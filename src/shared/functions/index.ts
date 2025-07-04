// 工具函数库
export function formatTime(seconds: number): string {
    const minutes = math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

export function generateId(): string {
    return tostring(tick());
}

export function clamp(value: number, min: number, max: number): number {
    return math.max(min, math.min(max, value));
}
