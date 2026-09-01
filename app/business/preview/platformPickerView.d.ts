export function pickerRows(state?: { selected?: string[] }): Array<{
  id: string;
  selectable: boolean;
  checked: boolean;
  reason: string;
}>;
export function toggle(selected: string[], id: string): string[];
export function pickerState(selected: string[]): 'decide' | 'chosen';
export function decideChip(state?: { selected?: string[] }): {
  id: string;
  selectable: boolean;
  checked: boolean;
  reason: string;
};
export function chooseDecide(): string[];
