import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // ✅ Add this
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"; // ✅ Date adapter
import { CircularProgress, Rating, TextField } from "@mui/material";
import styled from "styled-components";
import { getPropertyDetails } from "../api";
import Button from "../componnents/Button"; // ✅ Fixed typo

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 50px;
  padding: 20px;
  height: 95vh;
  margin: 0 20px;
  background: ${({ theme }) => theme.bg};
  border-radius: 12px 12px 0 0;
  overflow-y: auto;
`;

const Image = styled.img`
  width: 50%;
  border-radius: 6px;
  object-fit: cover;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const Span = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  text-decoration: line-through;
`;

const Percent = styled.span`
  font-size: 16px;
  color: green;
  font-weight: 500;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BookingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PropertyDetails = () => {
  const { id } = useParams();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPropertyDetailsById = async () => {
    try {
      setLoading(true);
      const res = await getPropertyDetails(id);
      setProperty(res.data);
    } catch (err) {
      console.error("Error fetching property:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPropertyDetailsById();
  }, [id]);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        property && (
          <Container>
            <Image src={property?.img} alt={property?.title} />
            <Right>
              <Title>{property?.title}</Title>
              <Desc>{property?.desc}</Desc>

              <Price>
                ${property?.price.org}
                <Span>${property?.price.mrp}</Span>
                <Percent>{property?.price.off}% Off</Percent>
              </Price>

              <RatingContainer>
                <Rating value={property?.rating} precision={0.1} readOnly />
                <span>({property?.rating})</span>
              </RatingContainer>

              <BookingContainer>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>

                <Button
                  variant="contained"
                  color="secondary"
                  text="Book Now"
                  onClick={() =>
                    console.log("Booking...", { startDate, endDate })
                  }
                />
              </BookingContainer>
            </Right>
          </Container>
        )
      )}
    </>
  );
};

export default PropertyDetails;
