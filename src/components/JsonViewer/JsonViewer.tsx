import * as React from 'react';
import styled from '../../styled-components';

import { SampleControls } from '../../common-elements';
import { CopyButtonWrapper } from '../../common-elements/CopyButtonWrapper';
import { PrismDiv } from '../../common-elements/PrismDiv';
import { jsonToHTML } from '../../utils/jsonToHtml';
import { OptionsContext } from '../OptionsProvider';
import { jsonStyles } from './style';
import * as yaml from 'js-yaml';

export interface JsonProps {
  data: any;
  className?: string;
}

const JsonViewerWrap = styled.div`
  &:hover > ${SampleControls} {
    opacity: 1;
  }
`;

class Json extends React.PureComponent<JsonProps> {
  node: HTMLDivElement;

  render() {
    return <CopyButtonWrapper data={this.yamlData()}>{this.renderInner}</CopyButtonWrapper>;
  }

  yamlData = () => {
    return yaml.dump(JSON.parse(JSON.stringify(this.props.data)));
  };

  renderInner = ({ renderCopyButton }) => (
    <JsonViewerWrap>
      <SampleControls>
        {renderCopyButton()}
        <span onClick={this.expandAll}> Expand all </span>
        <span onClick={this.collapseAll}> Collapse all </span>
      </SampleControls>
      <OptionsContext.Consumer>
        {options => (
          <PrismDiv
            className={this.props.className}
            // tslint:disable-next-line
            ref={node => (this.node = node!)}
            dangerouslySetInnerHTML={{
              __html: jsonToHTML(this.props.data, options.jsonSampleExpandLevel),
            }}
          />
        )}
      </OptionsContext.Consumer>
    </JsonViewerWrap>
  );

  expandAll = () => {
    const elements = this.node.getElementsByClassName('collapsible');
    for (const collapsed of Array.prototype.slice.call(elements)) {
      (collapsed.parentNode as Element)!.classList.remove('collapsed');
    }
  };

  collapseAll = () => {
    const elements = this.node.getElementsByClassName('collapsible');
    // skip first item to avoid collapsing whole object/array
    const elementsArr = Array.prototype.slice.call(elements, 1);

    for (const expanded of elementsArr) {
      (expanded.parentNode as Element)!.classList.add('collapsed');
    }
  };

  clickListener = (event: MouseEvent) => {
    let collapsed;
    const target = event.target as HTMLElement;
    if (target.className === 'collapser') {
      collapsed = target.parentElement!.getElementsByClassName('collapsible')[0];
      if (collapsed.parentElement.classList.contains('collapsed')) {
        collapsed.parentElement.classList.remove('collapsed');
      } else {
        collapsed.parentElement.classList.add('collapsed');
      }
    }
  };

  componentDidMount() {
    this.node!.addEventListener('click', this.clickListener);
  }

  componentWillUnmount() {
    this.node!.removeEventListener('click', this.clickListener);
  }
}

export const JsonViewer = styled(Json)`
  ${jsonStyles};
`;
