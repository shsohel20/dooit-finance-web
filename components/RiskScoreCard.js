import { cn, riskLevelVariants } from '@/lib/utils';
import { Badge } from './ui/badge';

const RiskScoreCard = ({ name, item }) => {
  return (
    <div
      className={cn(' rounded-md p-4 max-w-sm w-full', {
        'bg-red-50': item?.score === 100,
        'bg-yellow-50': item?.score > 80 && item?.score < 100,
        'bg-orange-50': item?.score > 60 && item?.score < 80,
        'bg-orange-50': item?.score > 40 && item?.score < 60,
        'bg-amber-50': item?.score > 20 && item?.score < 40,
        'bg-blue-50': item?.score > 10 && item?.score <= 20,
        'bg-green-50': item?.score <= 10,
      })}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-bold text-gray-700">{name}</span>
          <p className=" text-gray-600">{item?.value || 'not specified'}</p>
        </div>
        <Badge
          className={cn('text-white', {
            'bg-red-500': item?.score === 100,
            'bg-yellow-500': item?.score > 80 && item?.score < 100,
            'bg-orange-500': item?.score > 60 && item?.score < 80,
            'bg-orange-500': item?.score > 40 && item?.score < 60,
            'bg-amber-500': item?.score > 20 && item?.score < 40,
            'bg-blue-500': item?.score > 10 && item?.score <= 20,
            'bg-green-500': item?.score <= 10,
          })}
          variant={riskLevelVariants[item?.score]}
        >
          Score: {item?.score}
        </Badge>
      </div>
    </div>
  );
};

export default RiskScoreCard;
