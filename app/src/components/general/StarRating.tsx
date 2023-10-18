import Icon from '@mdi/react';
import { mdiStar, mdiStarOutline, mdiStarHalfFull } from '@mdi/js';

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  starCount?: number;
  className?: string;
}

/**
 * Helper function for rounding to nearest half
 * 
 * @param num
 * @returns rounded number
 */
const roundHalf = (num: number) => {
  return Math.round(num * 2) / 2;
}

/**
 * @param props 
 * @param props.rating
 * @param props.maxRating (optional) default=5
 * @param props.starCount (optional) default=5
 * @param props.className (optional)
 * @returns HTML Element
 * 
 * #### This component takes a rating and displays it as stars.
 * 
 * It is mainly used to display an average rating of 1 to 5.\
 * But it can take any range of ratings and display it as any amount of stars.
 */
const StarRating = (props: StarRatingProps) => {
  const maxRating: number = props.maxRating ?? 5;
  const starCount: number = props.starCount ?? 5;
  const { rating } = props;

  // Calculate how many stars should be filled
  const ratingPercentage: number = rating / maxRating;
  const totalFilledStars: number = roundHalf(ratingPercentage * starCount ?? 5);
  const fullStars: number = Math.floor(totalFilledStars);
  const shouldShowHalfStar: boolean = totalFilledStars % 1 == 0.5;
  const emptyStars: number = starCount - fullStars - (shouldShowHalfStar ? 1 : 0);

  return <>
  <div className='flex flex-row'>
    {/* Generate full stars */}
    {Array.from(Array(fullStars).keys()).map((i) => {
      return <Icon key={i} path={mdiStar} className='text-star' />
    })}

    {/* Generate half star if needed */}
    {shouldShowHalfStar && <Icon path={mdiStarHalfFull} className='text-star' />}

    {/* Generate empty stars */}
    {Array.from(Array(emptyStars).keys()).map((i) => {
      return <Icon key={i} path={mdiStarOutline} className='text-star' />
    })}

    {/* Display the rating as text */}
    <p className={'text-star ml-1 '+props.className ?? ''}>
      {Math.round(rating * 10) / 10}
    </p>

  </div></>;
}

export default StarRating;