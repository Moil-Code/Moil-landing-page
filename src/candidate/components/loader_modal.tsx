import React from 'react';
import PencilLoader from './PencilLoader';
import { createPortal } from 'react-dom';

const LoaderModal = ({ text }: { text: string }) => {
/* 	let text;
	if (window.location.pathname === "/upload") {
		text = text;
	} else if (window.location.pathname.includes("/form")) {
		text = text
	} */
	return createPortal(
		<div className="fixed top-0 left-0 bottom-0 right-0 z-10 bg-tet-600 backdrop-blur-[2px] flex justify-center items-center">
			<section className="bg-white sm:max-w-[500px] flex flex-col items-center min-w-[300px] w-[80%] mt-10 mx-auto rounded-3xl sm:px-10 py-11 px-3 font-main">
				<PencilLoader />
				<p className="text-pry-900 text-base my-4 font-semibold text-center">
					{text}
				</p>
				{/* <button
					onClick={onClick}
					type="button"
					className="bg-pry-900 rounded-3xl py-3 px-9 text-center text-white font-semibold">
					{language["continue_btn"]}
				</button> */}
			</section>
		</div>,
		document.getElementById("modal") as HTMLElement
	);
};

export default LoaderModal;
