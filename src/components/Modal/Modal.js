import React from "react";

import styles from "./Modal.module.css";

function Modal(props) {
  return (
    <div
      className={styles.container}
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <div
        className={styles.inner}
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
