import React from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import styles from "./TreeView.module.css";

export function TreeView(props) {
  return (<Tree
    ref={props.treeRef}
    tree={props.tree}
    onDrop={props.onDrop}
    rootId={props.rootId}
    canDrop={props.canDrop}
    onDragEnd={props.onDragEnd}
    classes={{
      root: styles.treeRoot,
      draggingSource: styles.draggingSource,
      dropTarget: styles.dropTarget,
    }}
    render={(node, options) => (
      <CustomNode
        node={!console.log("render!") && node}
        {...options}
        filteredNodes={props.filteredNodes}
        isFiltering={props.isFiltering}
      />
    )}
    dragPreviewRender={(monitorProps) => (
      <CustomDragPreview monitorProps={monitorProps} />
    )}
  />);
}