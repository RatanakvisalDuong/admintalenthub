import React from 'react';
import Image from 'next/image';
import { Achievement } from '@/app/type/achievement';


export default function AchievementCard({ achievement, onClick }: { achievement: Achievement; onClick: () => void }) {
	return (
		<div
			className="bg-white w-full h-55 shadow-md mt-4 px-4 py-2 rounded-xl cursor-pointer hover:transform hover:scale-105"
			onClick={onClick}
		>
			<div className="flex w-full justify-between">
				<div className="w-[70%] overflow-hidden">
					<p className="text-sm text-gray-600">{achievement.title}</p>
				</div>
				{achievement.endorsers && achievement.endorsers.filter(endorser => endorser.status_id === 2).length > 0 && (
					<div className="w-[30%] h-auto flex justify-end">
						<Image src="/verified.png" alt="Verified" width={30} height={30} className="w-[30px] h-[30px] mr-2" />
					</div>
				)}

			</div>
			<p className="text-[12px] text-[#808080] mt-1">Issued Date: {achievement.issue_month} {achievement.issue_year}</p>
			<div className='w-[220px] h-[130px] mt-2'>
				<Image
					src={achievement.image}
					alt="Certificate"
					width={200}
					height={130}
					className="w-[220px] h-[130px]"
				/>
			</div>
		</div>
	);
};
