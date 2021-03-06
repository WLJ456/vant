import { App, TeleportProps } from 'vue';
import { inBrowser } from '../utils';
import { Interceptor } from '../utils/interceptor';
import { mountComponent, usePopupState } from '../utils/mount-component';
import VanDialog, {
  DialogTheme,
  DialogAction,
  DialogMessageAlign,
} from './Dialog';

export type DialogOptions = {
  title?: string;
  width?: string | number;
  theme?: DialogTheme;
  message?: string;
  overlay?: boolean;
  teleport?: TeleportProps['to'];
  className?: any;
  allowHtml?: boolean;
  lockScroll?: boolean;
  transition?: string;
  beforeClose?: Interceptor;
  messageAlign?: DialogMessageAlign;
  overlayClass?: string;
  overlayStyle?: Record<string, any>;
  closeOnPopstate?: boolean;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelButtonColor?: string;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  closeOnClickOverlay?: boolean;
};

// TODO remove any
let instance: any;

function initInstance() {
  const Wrapper = {
    setup() {
      const { state, toggle } = usePopupState();
      return () => <VanDialog {...{ ...state, 'onUpdate:show': toggle }} />;
    },
  };

  ({ instance } = mountComponent(Wrapper));
}

function Dialog(options: DialogOptions) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    if (!instance) {
      initInstance();
    }

    instance.open({
      ...Dialog.currentOptions,
      ...options,
      callback: (action: DialogAction) => {
        (action === 'confirm' ? resolve : reject)(action);
      },
    });
  });
}

Dialog.defaultOptions = {
  title: '',
  width: '',
  theme: null,
  message: '',
  overlay: true,
  callback: null,
  teleport: 'body',
  className: '',
  allowHtml: false,
  lockScroll: true,
  transition: 'van-dialog-bounce',
  beforeClose: null,
  overlayClass: '',
  overlayStyle: null,
  messageAlign: '',
  cancelButtonText: '',
  cancelButtonColor: null,
  confirmButtonText: '',
  confirmButtonColor: null,
  showConfirmButton: true,
  showCancelButton: false,
  closeOnPopstate: true,
  closeOnClickOverlay: false,
};

Dialog.currentOptions = {
  ...Dialog.defaultOptions,
};

Dialog.alert = Dialog;

Dialog.confirm = (options: DialogOptions) =>
  Dialog({
    showCancelButton: true,
    ...options,
  });

Dialog.close = () => {
  if (instance) {
    instance.toggle(false);
  }
};

Dialog.setDefaultOptions = (options: DialogOptions) => {
  Object.assign(Dialog.currentOptions, options);
};

Dialog.resetDefaultOptions = () => {
  Dialog.currentOptions = { ...Dialog.defaultOptions };
};

Dialog.install = (app: App) => {
  app.use(VanDialog as any);
  app.config.globalProperties.$dialog = Dialog;
};

Dialog.Component = VanDialog;

export default Dialog;
