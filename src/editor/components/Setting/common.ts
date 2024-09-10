export enum ActionEnum {
  showTip = "showTip",
  gotoLink = "gotoLink",
}

export interface GotoLinkConfig {
  url: string;
  type: ActionEnum.gotoLink;
}

export interface ShowTipConfig {
  messageType?: string;
  text?: string;
  type: ActionEnum.showTip;
}
