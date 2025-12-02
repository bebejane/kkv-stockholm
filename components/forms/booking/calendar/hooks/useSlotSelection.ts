import { tzDate } from '@/lib/dates';
import { createElement, RefObject, useEffect, useRef, useState } from 'react';

export type SlotSelectionProps = {
	ref: RefObject<HTMLDivElement | null>;
};

export function useSlotSelection({ ref }: SlotSelectionProps) {
	const mouseDown = useRef(false);
	const dragging = useRef(false);
	const start = useRef<[number, number] | null>(null);
	const end = useRef<[number, number] | null>(null);
	const frame = useRef<HTMLDivElement | null>(null);
	const area = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
	const [selection, setSelection] = useState<[Date, Date] | null>(null);

	function reset() {
		setSelection(null);
		resetFrame();
	}

	function createFrame() {
		if (!frame.current) {
			frame.current = document.createElement('div');
			ref.current?.appendChild(frame.current);
		}
		resetFrame();
		return frame.current;
	}

	function resetFrame() {
		console.log('resetFrame');
		if (!frame.current) return;

		frame.current.style.all = 'unset';
		frame.current.style.position = 'absolute';
		frame.current.style.opacity = '0';
		frame.current.style.top = '0';
		frame.current.style.left = '0';
		frame.current.style.pointerEvents = 'none';
		frame.current.style.zIndex = '1000';
		frame.current.style.border = '1px solid red';
	}

	function updateFrame() {
		if (!start.current || !end.current || !ref.current || !frame.current) return;

		const leftOffset = ref.current.getBoundingClientRect().left;
		const topOffset = ref.current.getBoundingClientRect().top;
		const left = Math.min(start.current[0], end.current[0]) - leftOffset;
		const top = Math.min(start.current[1], end.current[1]) - topOffset;
		const width = Math.abs(start.current[0] - end.current[0]);
		const height = Math.abs(start.current[1] - end.current[1]);

		frame.current.style.left = `${left}px`;
		frame.current.style.top = `${top}px`;
		frame.current.style.width = `${width}px`;
		frame.current.style.height = `${height}px`;
		area.current = { x: left, y: top, width, height };
		updateSelection();
	}

	function updateSelection() {
		if (!area.current || !ref.current) return;

		const cols = ref.current?.querySelectorAll<HTMLDivElement>('div[data-type="slot"]');
		if (!cols) return;

		const { x, y, width, height } = area.current;
		const { left: leftOffset, top: topOffset } = ref.current.getBoundingClientRect();
		const selection: [Date, Date][] = [];

		cols.forEach((col, index) => {
			const colRect = col.getBoundingClientRect();
			const colLeft = colRect.left - leftOffset;
			const colTop = colRect.top - topOffset;
			const colRight = colLeft + colRect.width;
			const colBottom = colTop + colRect.height;

			if (x < colRight && x + width > colLeft && y <= colBottom && y + height >= colTop) {
				const start = col.dataset.start as string;
				const end = col.dataset.end as string;
				selection.push([tzDate(start), tzDate(end)]);
			}
		});

		if (selection.length < 1) return setSelection(null);

		const sorted = selection.sort((a, b) => (a[0].getTime() < b[0].getTime() ? -1 : 1));
		setSelection([sorted[0][0], sorted[sorted.length - 1][1]]);
	}

	function clearSelection() {
		setSelection(null);
		reset();
	}

	useEffect(() => {
		if (!ref.current) return;

		createFrame();

		const container = ref.current;

		function handleMouseEnter(e: MouseEvent) {}

		function handleMouseLeave(e: MouseEvent) {}

		function handleMouseDown(e: MouseEvent) {
			mouseDown.current = true;
			start.current = [e.x, e.y];
			end.current = [e.x, e.y];
			updateFrame();
			if (frame.current) frame.current.style.opacity = '1';
			updateSelection();
		}

		function handleMouseUp(e: MouseEvent) {
			mouseDown.current = false;
			start.current = null;
			end.current = null;
			dragging.current = false;
			area.current = null;
			resetFrame();
		}

		function handleMouseMove(e: MouseEvent) {
			dragging.current = mouseDown.current;
			mouseDown.current && (end.current = [e.x, e.y]);
			if (!dragging.current) return;
			updateFrame();
		}

		container.addEventListener('mousedown', handleMouseDown);
		container.addEventListener('mouseup', handleMouseUp);
		container.addEventListener('mousemove', handleMouseMove);
		container.addEventListener('mouseleave', handleMouseLeave);
		container.addEventListener('mouseenter', handleMouseEnter);

		return () => {
			container.removeEventListener('mousedown', handleMouseDown);
			container.removeEventListener('mouseup', handleMouseUp);
			container.removeEventListener('mousemove', handleMouseMove);
			container.removeEventListener('mouseleave', handleMouseLeave);
			container.removeEventListener('mouseenter', handleMouseEnter);
		};
	}, []);

	return {
		selection,
		clearSelection,
	};
}
