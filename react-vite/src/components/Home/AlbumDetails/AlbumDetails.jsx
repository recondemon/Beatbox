import { useParams } from 'react-router-dom';
import { fetchAlbumById, selectAlbumById } from '../../../redux/albums';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import ListDetails from "../../ListDetails";

const AlbumDetails = () => {
  const dispatch = useDispatch();
  const { albumId } = useParams();
  const album = useSelector(selectAlbumById(albumId));

  useEffect(() => {
    dispatch(fetchAlbumById(albumId));
  }, [dispatch, albumId]);

  return <ListDetails list={album} />;
};

export default AlbumDetails;
