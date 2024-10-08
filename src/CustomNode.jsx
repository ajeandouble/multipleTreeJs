import React from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TypeIcon } from "./TypeIcon";
import styles from "./CustomNode.module.css";

export const CustomNode = (props) => {
  const { droppable } = props.node;
  const indent = props.depth * 24;
  const { filteredNodes } = props;

  const handleToggle = (e) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  if (
    !props.isFiltering ||
    (filteredNodes && filteredNodes.has(props.node.id))
  ) {
    return droppable ? (
      <div
        className={styles.root}
        // style={{
        //   paddingInlineStart: indent,
        //   backgroundColor: "red",
        //   position: "sticky",
        //   top: "2rem",
        // }}
      >
        <div className={`${styles.arrow} ${props.isOpen ? styles.isOpen : ""}`}>
          {props.node.droppable && (
            <div onClick={handleToggle}>
              <ArrowRightIcon />
            </div>
          )}
        </div>
        <div className={styles.filetype}>
          <TypeIcon droppable={droppable || false} />
        </div>
        <div className={styles.label}>
          <Typography variant="body2">{props.node.text}</Typography>
        </div>
      </div>
    ) : (
      <div className={styles.root} style={{ paddingInlineStart: indent }}>
        <div className={`${styles.arrow} ${props.isOpen ? styles.isOpen : ""}`}>
          {props.node.droppable && (
            <div onClick={handleToggle}>
              <ArrowRightIcon />
            </div>
          )}
        </div>
        <div className={styles.filetype}>
          <TypeIcon droppable={droppable || false} />
        </div>
        <div className={styles.label}>
          <Typography variant="body2">{props.node.text}</Typography>
        </div>
      </div>
    );
  }
};
