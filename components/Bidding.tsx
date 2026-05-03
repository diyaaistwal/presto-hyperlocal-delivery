
import React from 'react';
import { Partner } from '../types';

interface BiddingProps {
  onClose: () => void;
  onSelectPartner: (partner: Partner) => void;
}

export const BiddingView: React.FC<BiddingProps> = ({ onClose, onSelectPartner }) => {

  const mockPartners: Partner[] = [
    {
      id: 'p1',
      name: 'Amit Kumar',
      avatar: '',
      rating: 4.9,
      reviews: 128,
      deliveryFee: 45,
      eta: '12 mins',
      distance: '1.2 km',
      isBestChoice: true
    },
    {
      id: 'p2',
      name: 'Suresh Raina',
      avatar: '',
      rating: 4.7,
      reviews: 85,
      deliveryFee: 30,
      eta: '18 mins',
      distance: '2.5 km'
    }
  ];

  return (
    <div className="p-6 space-y-4">
      {mockPartners.map((partner) => (
        <div key={partner.id} className="border p-4 rounded-xl">

          <h3 className="font-bold">{partner.name}</h3>
          <p>₹{partner.deliveryFee} • {partner.eta}</p>

          <button
            onClick={async () => {
              // 🔥 select partner
              onSelectPartner(partner);

              // 🔥 trigger backend reply
              await fetch("https://presto-backend-ckt0.onrender.com/chat", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  message: "confirm order",
                  partner: partner.name
                })
              });

              onClose(); // close bidding screen
            }}
            className="mt-3 bg-black text-white px-4 py-2 rounded-xl"
          >
            Select Partner
          </button>

        </div>
      ))}
    </div>
  );
};

