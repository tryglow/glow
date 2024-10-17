import {
  ComponentType,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

interface BasicProps {
  width?: number;
  children?: ReactNode;
}

export function WidthProvideRGL<Config extends BasicProps>(
  ComposedComponent: ComponentType<Config>,
  isPotentiallyMobile: boolean
): FC<Config> {
  return function WidthProvider(props: Config) {
    const [width, setWidth] = useState<number>(
      isPotentiallyMobile ? 400 : 1280
    );

    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        if (elementRef.current) {
          const newWidth = entries[0].contentRect.width;
          setWidth(newWidth);
        }
      });

      if (elementRef.current) {
        resizeObserver.observe(elementRef.current);
      }

      return () => {
        if (elementRef.current) {
          resizeObserver.unobserve(elementRef.current);
        }
        resizeObserver.disconnect();
      };
    }, []);

    // Use a custom prop for the ref to avoid conflicts with existing `ref` props
    const composedComponentProps = {
      ...props,
      width,
      innerRef: elementRef,
    };

    return <ComposedComponent {...composedComponentProps} />;
  };
}
