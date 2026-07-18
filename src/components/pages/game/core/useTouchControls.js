import { useCallback, useRef, useState } from 'react';

const EMPTY_INPUT = { x: 0, y: 0, active: false, firing: false, pointerId: null };

export const useTouchControls = (unlockAudio) => {
  const [stick, setStick] = useState({ x: 0, y: 0 });
  const inputRef = useRef({ ...EMPTY_INPUT });

  const updateJoystick = useCallback((event) => {
    const input = inputRef.current;
    if (!input.active || input.pointerId !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    let x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    let y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const magnitude = Math.hypot(x, y);
    if (magnitude > 1) { x /= magnitude; y /= magnitude; }
    inputRef.current = { ...input, x, y };
    setStick({ x, y });
  }, []);

  const startJoystick = useCallback((event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    inputRef.current = { ...inputRef.current, active: true, pointerId: event.pointerId };
    unlockAudio();
    updateJoystick(event);
  }, [unlockAudio, updateJoystick]);

  const stopJoystick = useCallback((event) => {
    if (inputRef.current.pointerId !== event.pointerId) return;
    inputRef.current = { ...inputRef.current, x: 0, y: 0, active: false, pointerId: null };
    setStick({ x: 0, y: 0 });
  }, []);

  const startFire = useCallback((event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    inputRef.current = { ...inputRef.current, firing: true };
    unlockAudio();
  }, [unlockAudio]);

  const stopFire = useCallback((event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    inputRef.current = { ...inputRef.current, firing: false };
  }, []);

  const reset = useCallback(() => {
    inputRef.current = { ...EMPTY_INPUT };
    setStick({ x: 0, y: 0 });
  }, []);

  return { inputRef, stick, updateJoystick, startJoystick, stopJoystick, startFire, stopFire, reset };
};
