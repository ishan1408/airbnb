import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Rating } from "@mui/material";
import styled from "styled-components";
import {
  AddShoppingCartOutlined,
  FavoriteBorder,
  FavoriteRounded,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";
import {
  addToCart,
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
} from "../../api";

const Card = styled.div`
  max-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease-out;
  cursor: pointer;
`;
const Image = styled.img`
  width: 100%;
  border-radius: 6px;
  object-fit: cover;
  transition: all 0.3s ease-out;
`;

const Menu = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  top: 14px;
  right: 14px;
  display: none;
  flex-direction: column;
  gap: 12px;
`;
const MenuItem = styled.div`
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background: white;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;
const Rate = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  bottom: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  opacity: 0.9;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 6px;
  transition: all 0.3s ease-out;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
  }
  &:hover ${Image} {
    opacity: 0.9;
  }
  &:hover ${Menu} {
    display: flex;
  }
`;
const Details = styled.div`
  display: flex;
  gap: 6px;
  flex-direction: column;
  padding: 4px 10px;
`;
const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Location = styled.div`
  width: fit-content;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 20px;
  background: ${({ theme }) => theme.disabled + 50};
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Strike = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;
const Span = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;
const Percent = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: green;
`;

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [favorite,setFavorite] = useState(false)
  const [favoriteLoading,setFavoriteLoading] = useState(false)

  const checkFavourite = async () => {
  setFavoriteLoading(true);
  const token = localStorage.getItem("airbnb-app-token");

  try {
    const res = await getFavourite(token);
    const isFavorite = res.data?.some(
      (fav) => fav._id === property?._id
    );
    setFavorite(isFavorite);
  } catch (err) {
    dispatch(openSnackbar({ message: err.response?.data?.message || "Something went wrong", severity: "error" }));
  } finally {
    setFavoriteLoading(false);
  }
};


  const addFavourite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("airbnb-app-token");
    await addToFavourite(token, { propertyId: property?._id })
      .then((res) => {
        setFavorite(true);
      })
      .catch((err) => {
        alert(err)
      }).finally(() => {
        setFavoriteLoading(false);
      })
  };

  const removeFavourite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("airbnb-app-token");
    await deleteFromFavourite(token, { propertyId: property?._id })
      .then((res) => {
        setFavorite(false);
      })
      .catch((err) => {
        alert(err)
      }).finally(() => {
        setFavoriteLoading(false);
      })
  };

  useEffect(() => {
    checkFavourite();
  }, []);

  return (
    <Card>
      <Top>
        <Image src={property?.img} alt={property?.title} />
        <Menu>
          <MenuItem 
          onClick={()=>(favorite ? removeFavourite(): addFavourite())}
          >
            {favoriteLoading ? (
              <CircularProgress sx={{ fontSize: '20px' }} />
            ) : (
              <>
              {favorite ? (
              <FavoriteRounded sx={{ fontSize: '20px', color: 'red' }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: '20px' }} />
            )}
            </>
            )}
          </MenuItem>
        </Menu>
        <Rate>
          <Rating value={property?.rating} sx={{ fontSize: '14px' }} />
        </Rate>
      </Top>

      <Details onClick={() => navigate(`/properties/${property?._id}`)}>
        <Title>{property?.title}</Title>
        <Desc>{property?.desc}</Desc>
        <Location>{property?.location}</Location>
        <Price>
          ${property?.price?.org}
          <Strike>${property?.price?.mrp}</Strike>
          <Percent>${property?.price?.off}% off</Percent>
        </Price>
      </Details>
    </Card>
  );
};


export default PropertyCard;
