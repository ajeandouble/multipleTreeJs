import React, { useState, useRef, useEffect } from "react";
import { getDescendants } from "@minoru/react-dnd-treeview";
import { TreeView } from "./TreeView";
import sampleData from "./multiple-tree.json";
import styles from "./App.module.css";

const LEFT_TREE = "LEFT_TREE";
const RIGHT_TREE = "RIGHT_TREE";

function filterFromTree(tree, str) {
  const filteredChildren = new Set();
  const filteredNodes = tree.filter((node) => node.text.includes(str));
  filteredNodes.forEach((node) => {
    filteredChildren.add(node.id);
    while (node && node.id !== LEFT_TREE) {
      node = tree.find((n) => n.id === node.parent);
      if (node) {
        filteredChildren.add(node.id);
      }
      // console.log({ node });
    }
  });
  // console.log({ filteredChildren, filteredNodes });
  return filteredChildren;
}

const savedTrees = [];
const savedTreesCurrIndex = -1;

// function savePreviousTreesState(trees) {
//   if (savedTrees.length >= 5) {
//     savedTrees.shift();
//   }
//   savedTrees.push(JSON.stringify(trees));
// }

// function getPreviousTreesState(trees) {
//   --savedTreesCurrIndex;
// }
// function getPreviousTreesState() {}

export default function App() {
  const [trees, setTrees] = useState(sampleData);
  const leftTreeData = trees ? trees[LEFT_TREE] : [];
  const rightTreeData = trees ? trees[RIGHT_TREE] : [];

  const [forbiddenDaD, setForbiddenDaD] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const TREE_HISTORY_LEN = 5;
  const [treeHistoryIdx, setTreeHistoryIdx] = useState(-1);
  const [treeHistory, setTreeHistory] = useState([]);

  function handleUndoRedo(event) {
    if (event.ctrlKey && event.key === "z" && treeHistoryIdx >= 0) {
      // Undo
      console.log(handleUndoRedo.name, "CTRL + z|Z", treeHistoryIdx);
      setTrees(JSON.parse(treeHistory[treeHistoryIdx]));
      setTreeHistoryIdx((prevIdx) => prevIdx - 1);
    } else if (
      event.ctrlKey &&
      event.key === "y" &&
      treeHistoryIdx < treeHistory.length - 1
    ) {
      // Redo
      console.log(
        handleUndoRedo.name,
        "CTRL + y|Y",
        treeHistoryIdx,
        treeHistory.length
      );
      setTrees(JSON.parse(treeHistory[treeHistoryIdx + 1]));
      setTreeHistoryIdx((prevIdx) => prevIdx + 1);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleUndoRedo);
    return () => document.removeEventListener("keydown", handleUndoRedo);
  });

  function savePreviousState(treeState) {
    console.log({ treeState });
    const updatedTreeHistory = [...treeHistory];
    if (treeHistoryIdx >= TREE_HISTORY_LEN - 1) {
      updatedTreeHistory.shift();
    }
    // In case Mutation on right tree while Undo in progress
    if (treeHistoryIdx + 1 !== treeHistory.length) {
      updatedTreeHistory.slice(-(treeHistoryIdx + 1 - treeHistory.length));
    }
    updatedTreeHistory.push(JSON.stringify(treeState));
    console.log("updatedtreeHistory:", [...updatedTreeHistory]);
    setTreeHistory([...updatedTreeHistory]);
    setTreeHistoryIdx((prevIdx) => prevIdx + 1);
  }

  function resetPreviousState() {
    if (treeHistoryIdx < 0) return;
    setTrees(JSON.parse(treeHistory[treeHistoryIdx]));
    setTreeHistoryIdx((prevIdx) => prevIdx - 1);
  }

  const getDestTree = (dropId, dropTarget) =>
    [LEFT_TREE, RIGHT_TREE].includes(dropId)
      ? dropId
      : [LEFT_TREE, RIGHT_TREE].includes(dropTarget?.tree)
      ? dropTarget.tree
      : null;

  const onDrop = (newTree, options) => {
    console.log("on drop");
    savePreviousState(trees);
    const { dragSourceId: dragId, dropTargetId: dropId, dropTarget } = options;

    let destTree = getDestTree(dropId, dropTarget);
    if (!destTree) {
      return;
    }
    console.log({ newTree, dragId, dropId, dropTarget });
    console.log({ destTree });
    // setRightTree(

    const updatedTree = newTree.map((node) => {
      // console.log("yo", dropId, dropTarget);
      if (node.id === dragId) {
        delete node.ref;
        return {
          ...node,
          tree: destTree,
        };
      }
      return node;
    });
    console.log({
      [LEFT_TREE]: leftTreeData,
      [RIGHT_TREE]: rightTreeData,
      [destTree]: updatedTree,
    });
    console.log({
      [LEFT_TREE]: leftTreeData,
      [RIGHT_TREE]: rightTreeData,
      [destTree]: updatedTree,
    });
    setTrees({
      [LEFT_TREE]: leftTreeData,
      [RIGHT_TREE]: rightTreeData,
      [destTree]: updatedTree,
    });
  };

  const canDrop = (_, dropInfo) => {
    const {
      dragSource,
      dropTarget,
      dragSourceId: dragId,
      dropTargetId: dropId,
    } = dropInfo;
    // Can't D&D nodes left tree nodes into their own tree or nodes from right tree into left tree
    console.log(dragSource?.tree, dropTarget?.tree);

    let dropTree = [LEFT_TREE, RIGHT_TREE].includes(dropId)
      ? dropId
      : [LEFT_TREE, RIGHT_TREE].includes(dropTarget?.tree)
      ? dropTarget.tree
      : null;
    if (!dropTree) {
      return;
    }

    let dragTree = [LEFT_TREE, RIGHT_TREE].includes(dropId)
      ? dragId
      : [LEFT_TREE, RIGHT_TREE].includes(dropTarget?.tree)
      ? dragSource.tree
      : null;
    if (!dragTree) {
      return;
    }
    console.log(dragTree);

    if (
      (dropTree === LEFT_TREE && dragTree === RIGHT_TREE) ||
      (dragTree && dropTree === LEFT_TREE)
    ) {
      console.log("Can't drop");
      setForbiddenDaD(true);
      setTimeout(() => setForbiddenDaD(false), 500);
      return false;
    }
    setForbiddenDaD(false);
    console.log("Can drop");
  };

  const onDragEnd = () => undefined;

  const onOpenBttn = () => {
    leftTreeRef.current.openAll();
  };

  const leftTreeRef = useRef(null);
  const rightTreeRef = useRef(null);

  const filteredNodes = filterFromTree(trees[LEFT_TREE], filterValue);
  return (
    <div>
      <pre>
        {treeHistoryIdx} - {JSON.stringify(treeHistory)}
      </pre>
      <button onClick={onOpenBttn}>CLICK ME ! OPEN ME!</button>
      {/* <pre>{JSON.stringify({ forbiddenDaD })}</pre>
      <pre>{JSON.stringify([...filteredNodes])}</pre> */}
      <input
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      ></input>
      <div className={styles.rootGrid}>
        <div className={styles.column}>
          <TreeView
            filteredNodes={filteredNodes}
            isFiltering={!!filterValue}
            tree={leftTreeData}
            treeRef={leftTreeRef}
            onDrop={onDrop}
            canDrop={canDrop}
            onDragEnd={onDragEnd}
            rootId={LEFT_TREE}
          />
        </div>
        <div className={styles.column}>
          <TreeView
            tree={rightTreeData}
            treeRef={rightTreeRef}
            onDrop={onDrop}
            canDrop={canDrop}
            onDragEnd={onDragEnd}
            rootId={RIGHT_TREE}
          />
        </div>
      </div>
    </div>
  );
}
