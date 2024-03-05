import React from 'react'
import { UserType } from '@/interfaces/user';
import { UserIcon } from '@heroicons/react/24/solid'

interface CardProfileProps {
  user?: UserType;
  onClick?: (address: string) => void;
}

export const CardProfile: React.FC<CardProfileProps> = ({
  user,
  onClick
}) => {
	return (
    <>
      <div className="relative flex flex-col break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16 p-6 max-w-xs">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full px-4 flex justify-center">
              <div className="relative">
                <div className="shadow-xl lign-middle border-none absolute ml-[calc(100%-56px)] -mt-14 w-28 h-28 bg-white rounded-full flex items-center justify-center">
                  <UserIcon className="text-gray-400 w-16" />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-20">
            <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700">
            {`${user?.id.slice(0, 6)}...${user?.id.slice(user?.id.length - 6)}`}
            </h3>
            <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
              {user?.role}
            </div>
          </div>
          {onClick && user?.id && (
            <button
              className="bg-slate-800 p-2 rounded-lg text-white font-medium mt-4 w-full"
              onClick={() => onClick(user?.id)}
            >
              Transfer
            </button>
          )}
          {/* <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-9/12 px-4">
                <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                  An artist of considerable range, Jenna the name taken by
                  Melbourne-raised, Brooklyn-based Nick Murphy writes, performs
                  and records all of his own music, giving it a warm, intimate
                  feel with a solid groove structure. An artist of considerable
                  range.
                </p>
                <a
                  href="#pablo"
                  className="font-normal text-lightBlue-500"
                  onClick={(e) => e.preventDefault()}
                >
                  Show more
                </a>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

