import { isTouchingRange, tzDate } from '@/lib/dates';
import { RefObject, use, useEffect, useRef, useState } from 'react';

export type SlotSelectionProps = {
	ref: RefObject<HTMLDivElement | null>;
	onSelect?: (selection: [Date, Date] | null) => void;
	disable?: boolean;
	range: [Date, Date];
	bookings?: AllBookingsSearchQuery['allBookings'] | null;
	key?: string;
};

export function useSlotSelection({
	ref,
	onSelect,
	disable,
	range,
	bookings,
	key,
}: SlotSelectionProps) {
	const mouseDown = useRef(false);
	const shiftDown = useRef(false);
	const dragging = useRef(false);
	const touch = useRef(false);
	const _selection = useRef<[Date, Date] | null>(null);
	const [selection, setSelection] = useState<[Date, Date] | null>(null);
	const start = useRef<[number, number] | null>(null);
	const end = useRef<[number, number] | null>(null);
	const frame = useRef<HTMLDivElement | null>(null);
	const area = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
	const cols = useRef<NodeListOf<HTMLDivElement> | undefined>(undefined);

	function reset() {
		resetFrame();
		start.current = null;
		end.current = null;
		touch.current = false;
		mouseDown.current = false;
		shiftDown.current = false;
		_setSelection(null);
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
		frame.current.style.zIndex = '100';
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
		frame.current.style.opacity = touch.current ? '0' : '1';
		area.current = { x: left, y: top, width, height };
	}

	function positionToSlot(x: number, y: number): [Date, Date] | null {
		if (!ref.current || !cols.current) return null;

		const col = Array.from(cols.current)?.find(
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
		if (!area.current || !ref.current || !cols.current) return;

		const { x, y, width, height } = area.current;
		const { left: leftOffset, top: topOffset } = ref.current.getBoundingClientRect();
		const selection: [Date, Date][] = [];

		cols.current.forEach((col) => {
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

		if (selection.length === 0) return _setSelection(null);

		const sorted = selection.sort((a, b) => (a[0].getTime() < b[0].getTime() ? -1 : 1));
		const newSelection: [Date, Date] = [sorted[0][0], sorted[sorted.length - 1][1]];

		//Avoid setting selection if inside other bookings
		if (
			bookings?.some(
				({ start, end, equipment }) =>
					equipment.some((e) => e.exclusive) && isTouchingRange([start, end], newSelection),
			)
		)
			return;

		_setSelection(newSelection);
	}

	function handleMouseDown(e: MouseEvent | TouchEvent) {
		_setSelection(null);
		onSelect?.(null);
		mouseDown.current = true;

		if (frame.current) frame.current.style.opacity = '1';
		const x =
			e.type === 'touchstart' ? (e as TouchEvent).targetTouches[0].clientX : (e as MouseEvent).x;
		const y =
			e.type === 'touchstart' ? (e as TouchEvent).targetTouches[0].clientY : (e as MouseEvent).y;
		const slot = positionToSlot(x, y);
		const currentSelection = _selection.current;

		if (
			// Remove selection if same slot is clicked
			slot &&
			currentSelection &&
			currentSelection[0].toISOString() === slot[0].toISOString() &&
			currentSelection[1].toISOString() === slot[1].toISOString()
		) {
			return reset();
		} else if (start.current && shiftDown.current) {
			// Add selection if shift is down
			end.current = [x, y];
		} else {
			start.current = [x, y];
			end.current = [x, y];
		}

		updateFrame();
		updateSelection();
	}

	function handleMouseUp(e: MouseEvent | TouchEvent) {
		mouseDown.current = false;
		dragging.current = false;
		resetFrame();
	}

	function handleMouseUpOutside(e: MouseEvent) {
		if (!ref.current?.contains(e.target as Node) && mouseDown.current) reset();
	}

	function handleMouseMove(e: MouseEvent | TouchEvent) {
		const x =
			e.type === 'touchmove' ? (e as TouchEvent).targetTouches[0].clientX : (e as MouseEvent).x;
		const y =
			e.type === 'touchmove' ? (e as TouchEvent).targetTouches[0].clientY : (e as MouseEvent).y;

		dragging.current = mouseDown.current;
		mouseDown.current && (end.current = [x, y]);
		if (!dragging.current) return;
		updateFrame();
		updateSelection();
	}

	function handleKey(e: KeyboardEvent) {
		shiftDown.current = e.key === 'Shift' && e.type === 'keydown' ? true : false;
	}

	function handleTouchStart(e: TouchEvent) {
		if (!ref.current) return;
		ref.current.style.touchAction = 'none';
		touch.current = true;
		handleMouseDown(e);
	}

	function handleTouchEnd(e: TouchEvent) {
		if (!ref.current) return;
		ref.current.style.touchAction = 'all';
		touch.current = false;
		handleMouseUp(e);
	}

	function handleTouchMove(e: TouchEvent) {
		if (!ref.current) return;
		touch.current = true;
		handleMouseMove(e);
	}

	useEffect(() => {
		if (!ref.current || disable) return;
		cols.current = ref.current.querySelectorAll<HTMLDivElement>(
			'div[data-state="available"],div[data-state="shared"]',
		);

		createFrame();
		const container = ref.current;

		container.addEventListener('mousedown', handleMouseDown);
		container.addEventListener('mouseup', handleMouseUp);
		container.addEventListener('mousemove', handleMouseMove);
		container.addEventListener('touchstart', handleTouchStart);
		container.addEventListener('touchend', handleTouchEnd);
		container.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('mouseup', handleMouseUpOutside);
		document.addEventListener('keydown', handleKey);
		document.addEventListener('keyup', handleKey);

		return () => {
			container.removeEventListener('mousedown', handleMouseDown);
			container.removeEventListener('mouseup', handleMouseUp);
			container.removeEventListener('mousemove', handleMouseMove);
			container.removeEventListener('touchstart', handleTouchStart);
			container.removeEventListener('touchend', handleTouchEnd);
			container.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('mouseup', handleMouseUpOutside);
			document.removeEventListener('keydown', handleKey);
			document.removeEventListener('keyup', handleKey);
		};
	}, [ref, range, JSON.stringify(bookings), key]);

	return {
		selection,
		setSelection: _setSelection,
		reset,
	};
}
