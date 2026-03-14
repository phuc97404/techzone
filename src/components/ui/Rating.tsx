import styles from "./Rating.module.css";

interface RatingProps {
  value: number;
  count?: number;
  showCount?: boolean;
}

const StarIcon = ({ filled, half }: { filled: boolean; half?: boolean }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill={filled ? "var(--color-warning)" : "none"} 
    stroke={filled || half ? "var(--color-warning)" : "var(--color-border)"} 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ position: 'relative' }}
  >
    {half && (
      <defs>
        <clipPath id="half-star">
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
    )}
    
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    
    {half && (
      <polygon 
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" 
        fill="var(--color-warning)" 
        clipPath="url(#half-star)"
      />
    )}
  </svg>
);

export default function Rating({ value, count = 0, showCount = true }: RatingProps) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={styles.rating}>
      <div className={styles.stars}>
        {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} filled={true} />)}
        {hasHalfStar && <StarIcon filled={false} half={true} />}
        {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} filled={false} />)}
      </div>
      {showCount && <span className={styles.count}>({count})</span>}
    </div>
  );
}
