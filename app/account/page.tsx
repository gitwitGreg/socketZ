'use client';
import Link from 'next/link';
import React, { useState } from 'react';

const account = () => {
  const [showAccount, setShowAccount] = useState(true);
  return (
    <section className="h-screen w-full bg-[#1e2124] flex">
      <div className="flex flex-col h-screen py-4 w-60 items-center gap-2 px-4 text-white border-[#424549] border-2 border-y-0">
        <button className="w-full rounded-lg py-2 hover:bg-[#424549]">
          My Account
        </button>
        <button className="w-full rounded-lg py-2 hover:bg-[#424549]">
          Profile
        </button>
      </div>
      <div className="w-auto justify-center flex py-20">
        {showAccount && (
            <div className="card w-[80%] bg-base-100 shadow-xl">
            <figure>
              <img
                src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                Shoes!
                <div className="badge badge-secondary">NEW</div>
              </h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              <div className="card-actions justify-end">
                <div className="badge badge-outline">Fashion</div>
                <div className="badge badge-outline">Products</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default account;
