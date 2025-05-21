import { Achievement } from "@/app/type/achievement";
import { Portfolio } from "@/app/type/portfolio";
import AchievementCard from "@/component/achievementCard/achievementCard";

export default function AchievementsSection({
    portfolio,
    owner,
    handleOpenAchievementDialog,
    addAchievementDialog
}: {
    portfolio: Portfolio;
    owner: boolean;
    handleOpenAchievementDialog: (achievement: Achievement) => void;
    addAchievementDialog: () => void;
}) {
    return (
        <div className={`h-[500px] bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 overflow-y-auto`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <i className="fas fa-trophy text-blue-500 text-sm sm:text-base md:text-lg mr-1 sm:mr-2"></i>
                    <p className="text-black font-bold text-base sm:text-lg">Achievements & Certificate</p>
                </div>
                {owner && (
                    <button
                        className="flex items-center bg-blue-500 font-semibold py-1 sm:py-2 px-2 sm:px-4 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:scale-105 transition-all duration-300 group"
                        onClick={addAchievementDialog}
                    >
                        <i className="fas fa-plus text-sm sm:text-base group-hover:text-white transition-colors duration-300"></i>
                    </button>
                )}
            </div>
            <div className="w-full bg-[#dfdfdf] h-[1px] sm:h-[2px] mt-1"></div>
            {portfolio.achievements.length === 0 ? (
                <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 justify-center items-center flex">No achievement & certificate available</p>
            ) : (
                portfolio.achievements.map((achievement) => (
                    <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        onClick={() => handleOpenAchievementDialog(achievement)}
                    />
                ))
            )}
        </div>
    );
}