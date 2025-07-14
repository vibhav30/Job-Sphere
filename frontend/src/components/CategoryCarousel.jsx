import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const jobTitles = [
  "Front End Engineer",
  "Software Engineer",
  "Graphic Designer",
  "Data Scientist",
  "Backend Developer"
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (title) => {
    dispatch(setSearchedQuery(title));
    navigate("/browse");
  };

  return (
    <div>
      <Carousel className="w-full max-w-4xl mx-auto my-20">
        <CarouselContent>
          {jobTitles.map((title, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Button
                onClick={() => searchJobHandler(title)}
                variant="outline"
                className="rounded-full"
              >
                {title}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
