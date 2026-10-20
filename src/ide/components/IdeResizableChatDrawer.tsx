import React from 'react';
import { AgentChatDrawer } from './AgentChatDrawer';
import { ResizeGutter } from './ResizeGutter';
import { MainLayoutProps } from '../types/layoutProps';

interface ChatDrawerProps {
  props: MainLayoutProps;
  chatWidth: number;
  onStartDrag: (e: React.MouseEvent) => void;
  onReset: () => void;
}

export const IdeResizableChatDrawer: React.FC<ChatDrawerProps> = ({
  props,
  chatWidth,
  onStartDrag,
  onReset,
}) => {
  return (
    <>
      <ResizeGutter onMouseDown={onStartDrag} onDoubleClick={onReset} title="Resize AI Assistant (Double-click to reset)" />
      <div style={{ width: `${chatWidth}px` }} className="shrink-0 flex h-full overflow-hidden select-none">
        <AgentChatDrawer
          messages={props.agentMessages}
          onSendMessage={props.onSendAgentMessage}
          isLoading={props.isAgentLoading}
          progressStep={props.progressStep}
          progressPercent={props.progressPercent}
          onClose={props.onCloseAgent || (() => {})}
          attachedContext={props.attachedContext}
          onRemoveContextItem={props.onRemoveContextItem}
          onAttachActiveFile={props.onAttachActiveFile}
          activeFileName={props.activeFile?.name}
          onUndoEdit={props.onUndoEdit}
          onRedoEdit={props.onRedoEdit}
          onOpenDiff={props.onOpenDiff}
          onUploadContextFile={props.onUploadContextFile}
        />
      </div>
    </>
  );
};
