import { createElement, RefObject, useEffect, useRef, useState } from 'react';

export type GridSelectionProps = {
	ref: RefObject<HTMLDivElement | null>;
};

export function useGridSelection({ ref }: GridSelectionProps) {
	const mouseDown = useRef(false);
	const dragging = useRef(false);
	const start = useRef<[number, number] | null>(null);
	const end = useRef<[number, number] | null>(null);
	const frame = useRef<HTMLDivElement | null>(null);
	const area = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
	const [selection, setSelection] = useState<[number, number][] | null>(null);

	function clearSelection() {
		setSelection(null);
	}

	function createFrame() {
		if (!frame.current) {
			frame.current = document.createElement('div');
			ref.current?.appendChild(frame.current);
		}
		frame.current.style.all = 'unset';
		frame.current.style.position = 'absolute';
		frame.current.style.opacity = '0';
		frame.current.style.top = '0';
		frame.current.style.left = '0';
		frame.current.style.pointerEvents = 'none';
		frame.current.style.zIndex = '1000';
		frame.current.style.border = '1px solid red';

		return frame.current;
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

		const { x, y, width, height } = area.current;
		const cols = ref.current?.querySelectorAll('div[data-type="slot"]');
		if (!cols) return;

		const leftOffset = ref.current.getBoundingClientRect().left;
		const topOffset = ref.current.getBoundingClientRect().top;
		const selection: [number, number][] = [];

		cols.forEach((col, index) => {
			const colRect = col.getBoundingClientRect();
			const colLeft = colRect.left - leftOffset;
			const colTop = colRect.top - topOffset;
			const colRight = colLeft + colRect.width;
			const colBottom = colTop + colRect.height;

			if (x < colRight && x + width > colLeft && y < colBottom && y + height > colTop) {
				const row = Math.floor(index / ref.current!.clientWidth); // Assuming a grid layout
				const colIndex = index % ref.current!.clientWidth;
				selection.push([row, colIndex]);
			}
		});

		//console.log(selection);
		//setSelection(selection);
	}

	useEffect(() => {
		if (!ref.current) return;

		const frame = createFrame();

		function handleMouseEnter(e: MouseEvent) {}

		function handleMouseLeave(e: MouseEvent) {}

		function handleMouseDown(e: MouseEvent) {
			mouseDown.current = true;
			start.current = [e.x, e.y];
			frame.style.opacity = '1';
			updateSelection();
		}

		function handleMouseUp(e: MouseEvent) {
			mouseDown.current = false;
			start.current = null;
			end.current = null;
			dragging.current = false;
			area.current = null;
			frame.style.opacity = '0';
		}

		function handleMouseMove(e: MouseEvent) {
			dragging.current = mouseDown.current;
			mouseDown.current && (end.current = [e.x, e.y]);
			if (!dragging.current) return;
			updateFrame();
		}

		ref.current?.addEventListener('mousedown', handleMouseDown);
		ref.current?.addEventListener('mouseup', handleMouseUp);
		ref.current?.addEventListener('mousemove', handleMouseMove);
		ref.current?.addEventListener('mouseleave', handleMouseLeave);
		ref.current?.addEventListener('mouseenter', handleMouseEnter);

		return () => {
			ref.current?.removeEventListener('mousedown', handleMouseDown);
			ref.current?.removeEventListener('mouseup', handleMouseUp);
			ref.current?.removeEventListener('mousemove', handleMouseMove);
			ref.current?.removeEventListener('mouseleave', handleMouseLeave);
			ref.current?.removeEventListener('mouseenter', handleMouseEnter);
		};
	}, [ref]);

	return {
		selection,
		clearSelection,
	};
}
