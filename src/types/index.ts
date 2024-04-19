interface NotificationType {
  id: number;
  message: string;
  showButtons?: boolean;
  acceptMessage?: string;
  acceptHandler?: () => void;
  cancelMessage?: string;
  cancelHandler?: () => void;
  hideIcon?: boolean;
  type: 'alert' | 'warning' | 'success' | 'default';
  width?: string;
  merged?: boolean;
}

export type { NotificationType };
