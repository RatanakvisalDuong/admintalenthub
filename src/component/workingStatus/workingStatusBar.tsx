export default function WorkingStatusBar({ status }: { status: number | null }) {
    return (
        <div
            className={` h-6 flex justify-center items-center  text-white text-[12px] rounded-xl ${status === 2 ? 'bg-[#00BD62]' : 'bg-[#0277B6]' 
            } ${status === 2 ? 'w-24' : 'w-16'
            }`}
        >
            {status === 2 ? 'Open for Work' : 'Working'}
        </div>
    );
}
