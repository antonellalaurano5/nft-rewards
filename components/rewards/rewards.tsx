import { useModal } from '@/hooks/modal';
import React from 'react'

export const RewardsComponent = () => {
	const { Modal, hide, isShow, show } = useModal();
	return (
    <div>
      <div className="relative">
        <div>
          <h5 className="text-2xl font-bold text-white">Rewards</h5>
        </div>

        <div className="mt-5">
          <button
            className="text-white font-bold p-2 text-xs bg-orange-400 rounded-lg"
            onClick={show}
          >
            {" "}
            + New Collection{" "}
          </button>
        </div>
        <div className="mt-10 flex">
          <div className="shadow-2xl p-4 rounded-lg">
            <div>
              <p className="font-bold ">Shokworks Academy</p>
            </div>
            <div className="flex justify-center mt-5">
              <img
                src="../img/poster-ceo.png"
                alt=""
                className="w-20 h-20 rounded-lg"
              />
            </div>
						<div>
							<button>
								<p className="text-blue-400 text-xs font-bold">View</p>
							</button>
						</div>
          </div>
        </div>
      </div>
      <Modal isShow={isShow}>
        <div>
          <div className="text-center">
            <p className="font-bold text-4xl ">New Collection</p>
          </div>
          <div className="flex gap-x-4 justify-end mt-10">
            <button
              className="bg-red-600 p-2 rounded-lg text-white font-bold"
              onClick={() => {
                hide();
              }}
            >
              Cancel
            </button>
            <button
              className="bg-green-600 p-2 rounded-lg text-white font-bold"
              onClick={() => {
                hide();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
