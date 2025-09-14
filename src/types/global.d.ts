import * as React from 'react';

declare module '*.svg' {
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: { [key: string]: Record<string, unknown> };
  export default content;
}

declare namespace JSX {
  interface Element extends React.ReactElement<unknown, unknown> {
    // Adding required properties to avoid empty interface
    props: Record<string, unknown>;
    key: string | null;
  }
  interface IntrinsicElements extends React.JSX.IntrinsicElements {
    // Adding example intrinsic elements
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
  }
}
