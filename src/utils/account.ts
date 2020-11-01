import { accountModule } from './../store/modules/account';

export function LogInRequired(
  target: Record<string, any>,
  key: string | symbol,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function(...args: any[]) {
    if (accountModule.user === null) {
      accountModule.setLogInDialog(true);
    } else {
      return original.apply(this, args);
    }
  };
}
