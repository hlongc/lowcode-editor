export enum ActionEnum {
  showTip = "showTip",
  gotoLink = "gotoLink",
  customJs = "customJs",
}

export enum ActionTypeEnum {
  link = "访问链接",
  tip = "消息提示",
  js = "自定义js",
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

export interface CustomJsConfig {
  type: ActionEnum.customJs;
  code?: string;
}

export type ActionConfig = GotoLinkConfig | ShowTipConfig | CustomJsConfig;
