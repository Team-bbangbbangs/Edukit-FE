declare module '*.svg' {
  import type React from 'react';

  interface SVGProps extends React.SVGProps<SVGSVGElement> {
    width?: string | number;
    height?: string | number;
  }

  const ReactComponent: React.FunctionComponent<SVGProps>;
  export default ReactComponent;
}
