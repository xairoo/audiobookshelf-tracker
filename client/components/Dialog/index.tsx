import { ReactNode } from "react";
import styled from "@emotion/styled";
import {
  Dialog as HUDialog,
  DialogPanel as HUDialogPanel,
} from "@headlessui/react";
import { Close } from "../Icons";
import { textColor } from "../../lib/styles";

const DialogWrapper = styled(HUDialog)`
  position: relative;
  z-index: 2000;
`;

const DialogOuter = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2rem;

  width: 100vw;

  background: var(--bg-overlay);
`;

interface DialogPanel {
  readonly width?: string;
  readonly height?: string;
}

const DialogPanel = styled(HUDialogPanel)<DialogPanel>`
  position: relative;
  width: 100%;

  max-width: ${(props) => (props.width ? props.width : `500px`)};
  max-height: ${(props) => (props.height ? props.height : `100%`)};

  margin-top: 1rem;
  background: var(--bg-secondary);
  padding: 1.5rem;
  box-shadow: 0px 1px 250px rgba(20, 17, 185, 0.8);
  border-radius: 5px;
`;

const CloseWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 25px;
  height: 25px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseIcon = styled(Close)`
  width: 20px;
  height: 20px;
`;

const Title = styled.h1`
  margin: 0 0 1.5rem;
  font-size: 20px;
`;

const DialogContent = styled.div`
  max-height: 100%;
  height: 100%;
`;

export default function DialogComponent({
  visible,
  onClose,
  title,
  children,
  width,
  height,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
  height?: string;
}) {
  function closeModal() {
    if (typeof onClose === "function") {
      onClose();
    }
  }

  return (
    <DialogWrapper open={visible} onClose={closeModal}>
      <DialogOuter>
        <DialogPanel width={width} height={height}>
          <CloseWrapper onClick={() => closeModal()}>
            <CloseIcon color={textColor} />
          </CloseWrapper>
          {title && <Title>{title}</Title>}
          <DialogContent>{children}</DialogContent>
        </DialogPanel>
      </DialogOuter>
    </DialogWrapper>
  );
}
