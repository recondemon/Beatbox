import { useDispatch, useSelector } from "react-redux";
import { selectIsLiked, likeSong, unLikeSong } from "../../redux/liked";
import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function LikeButton({ song }) {
  const isLiked = useSelector((state) => selectIsLiked(state, song.id));
  const dispatch = useDispatch();

  return (
    <>
      {isLiked ? (
        <FaHeart
          onClick={() => dispatch(unLikeSong(song))}
          className="cursor-pointer text-primary font-xl"
          size={24}
        />
      ) : (
        <FaRegHeart
          onClick={() => dispatch(likeSong(song))}
          className="cursor-pointer text-primary font-xl"
          size={24}
        />
      )}
    </>
  );
}
