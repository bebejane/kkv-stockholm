import { tzDate } from '@/lib/dates';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useThrottle } from 'react-use';

export type SlotSelectionProps = {
	ref: RefObject<HTMLDivElement | null>;
};

export function useSlotSelection({ ref }: SlotSelectionProps) {
	const mouseDown = useRef(false);
	const shiftDown = useRef(false);
	const dragging = useRef(false);
	const _selection = useRef<[Date, Date] | null>(null);
	const [selection, setSelection] = useState<[Date, Date] | null>(null);
	const start = useRef<[number, number] | null>(null);
	const end = useRef<[number, number] | null>(null);
	const frame = useRef<HTMLDivElement | null>(null);
	const area = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

	function reset() {
		resetFrame();
		_setSelection(null);
		start.current = null;
		end.current = null;
	}

	function createFrame() {
		if (!frame.current) {
			frame.current = document.createElement('div');
			ref.current?.appendChild(frame.current);
		}
		resetFrame();
		return frame.current;
	}

	function _setSelection(sel: [Date, Date] | null) {
		_selection.current = sel;
		setSelection(sel);
	}

	function resetFrame() {
		if (!frame.current) return;

		frame.current.style.all = 'unset';
		frame.current.style.position = 'absolute';
		frame.current.style.opacity = '0';
		frame.current.style.top = '0';
		frame.current.style.left = '0';
		frame.current.style.pointerEvents = 'none';
		frame.current.style.zIndex = '1000';
		frame.current.style.border = '2px solid var(--primary-light)';
		area.current = null;
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
	}

	function positionToSlot(x: number, y: number): [Date, Date] | null {
		if (!ref.current) return null;
		const cols = ref.current?.querySelectorAll<HTMLDivElement>('div[data-state="available"]');
		const col = Array.from(cols)?.find(
			(col) =>
				col.getBoundingClientRect().left <= x &&
				col.getBoundingClientRect().right >= x &&
				col.getBoundingClientRect().top <= y &&
				col.getBoundingClientRect().bottom >= y,
		);
		if (!col) return null;
		const start = col.dataset.start as string;
		const end = col.dataset.end as string;
		return [tzDate(start), tzDate(end)];
	}

	function updateSelection() {
		if (!area.current || !ref.current) return;

		const cols = ref.current?.querySelectorAll<HTMLDivElement>('div[data-state="available"]');

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

		if (selection.length < 1) return _setSelection(null);

		const sorted = selection.sort((a, b) => (a[0].getTime() < b[0].getTime() ? -1 : 1));

		// Avoid setting selection if it's not the same day
		if (_selection.current && _selection.current?.[0].getDate() !== sorted[0][0].getDate()) return;

		_setSelection([sorted[0][0], sorted[sorted.length - 1][1]]);
	}

	useEffect(() => {
		console.log('test');
		if (!ref.current) return;

		createFrame();

		const container = ref.current;

		function handleMouseDown(e: MouseEvent) {
			_setSelection(null);
			mouseDown.current = true;

			if (frame.current) frame.current.style.opacity = '1';

			const slot = positionToSlot(e.x, e.y);
			const currentSelection = _selection.current;

			if (
				// Remove selection if same slot is clicked
				slot &&
				currentSelection &&
				currentSelection[0].toISOString() === slot[0].toISOString() &&
				currentSelection[1].toISOString() === slot[1].toISOString()
			) {
				reset();
				return;
			} else if (start.current && shiftDown.current) {
				// Add selection if shift is down
				end.current = [e.x, e.y];
			} else {
				start.current = [e.x, e.y];
				end.current = [e.x, e.y];
			}

			updateFrame();
			updateSelection();
		}

		function handleMouseUp(e: MouseEvent) {
			mouseDown.current = false;
			dragging.current = false;
			resetFrame();
		}

		function handleMouseMove(e: MouseEvent) {
			dragging.current = mouseDown.current;
			mouseDown.current && (end.current = [e.x, e.y]);
			if (!dragging.current) return;
			updateFrame();
			updateSelection();
		}

		function handleMouseEnter(e: MouseEvent) {}

		function handleMouseLeave(e: MouseEvent) {
			if (!mouseDown.current) return;
			reset();
		}

		function handleKey(e: KeyboardEvent) {
			shiftDown.current = e.key === 'Shift' && e.type === 'keydown' ? true : false;
		}

		container.addEventListener('mousedown', handleMouseDown);
		container.addEventListener('mouseup', handleMouseUp);
		container.addEventListener('mousemove', handleMouseMove);
		container.addEventListener('mouseleave', handleMouseLeave);
		container.addEventListener('mouseenter', handleMouseEnter);
		document.addEventListener('keydown', handleKey);
		document.addEventListener('keyup', handleKey);

		return () => {
			container.removeEventListener('mousedown', handleMouseDown);
			container.removeEventListener('mouseup', handleMouseUp);
			container.removeEventListener('mousemove', handleMouseMove);
			container.removeEventListener('mouseleave', handleMouseLeave);
			container.removeEventListener('mouseenter', handleMouseEnter);
			document.removeEventListener('keydown', handleKey);
			document.removeEventListener('keyup', handleKey);
		};
	}, [ref]);

	return {
		selection,
		reset,
	};
}
