import { useCallback, useState, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
/* import { XIcon } from '@heroicons/react/outline'; */
import Styles from "./styles.module.scss";
import clsx from "clsx";
export const useModal = () => {
  const [isShow, setIsShow] = useState(false);
  const cancelButtonRef = useRef<HTMLDivElement>(null);
  const hide = () => {
    setIsShow(false);
  };

  const show = () => {
    setIsShow(true);
  };

  const Modal = useCallback(({ children, isShow }: any) => {
    return (
      <Transition.Root show={isShow} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-20  inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={isShow}
          onClose={hide}
        >
          <div
            className={clsx(
              "flex items-center justify-center text-center  ",
              Styles.bgOverlay,
              Styles.paddingModal
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-transparent-45 transition-opacity" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:align-middle sm:min-h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className={clsx(
                  " inline-block align-bottom text-left  shadow-md overflow-hidden transform transition-all w-full  ",
                  Styles.rounded,
                  Styles.bgContainer
                )}
              >
                <div
                  className={clsx(
                    "  overflow-y-auto flex flex-col",
                    Styles.paddingModalChildren
                  )}
                >
                  <div className="flex justify-end ">
                    <div className=" flex justify-end">
                      <button
                        type="button"
                        className=" focus:outline-none"
                        onClick={() => hide()}
                      >
                        <span className="sr-only">Close</span>X
                      </button>
                    </div>
                  </div>
                  <div>{children}</div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }, []);

  return { Modal, hide, isShow, show };
};
