import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useI18n } from '../../i18n/I18nProvider';

export type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
};

export function AppLink({ href, onClick, target, children, ...props }: AppLinkProps) {
  const { navigate } = useI18n();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    let destination: URL;
    try {
      destination = new URL(href, window.location.href);
    } catch {
      event.preventDefault();
      return;
    }

    if (destination.protocol !== 'http:' && destination.protocol !== 'https:') {
      event.preventDefault();
      return;
    }
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === '_blank' ||
      props.download !== undefined
    )
      return;
    if (href.startsWith('#') || destination.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(`${destination.pathname}${destination.search}${destination.hash}`);
  }

  return (
    <a href={href} target={target} {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
