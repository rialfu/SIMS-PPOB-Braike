import React, { useEffect } from "react"
import Slider from "react-slick";

import { useState } from "react"
import { useSelector} from "react-redux"
import { useLoaderData, useNavigate } from "react-router"
import Layout from '../layouts/base-header-profile'
import apiClient from "../parameter/axios-global";

export default function dashboard() {
  const auth = useSelector((state)=>state.auth)
  const data = useLoaderData()
  const navigate = useNavigate()
  const [services, setService] = useState([])
  const [banner, setBanner] = useState([])
  const toggleVisibility = () => {
    
  }
  console.log(auth,data)
  async function getService(){
    try{
        const resService = await apiClient.get('/services')
        setService((resService.data?.data || [] ))
      }catch(err){
        console.log('erro',err)
      }
  }
  function changePage(code){
    console.log(code)
    navigate(`/buy/${code}`)
  }
  async function getBanner(){
    try{
      const resBanner = await apiClient.get('/banner')
      setBanner((resBanner.data?.data || [] ))
    }catch(err){
      console.log('erro',err)
    }
  }
  useEffect(() => {
    console.log('jalan pertama')
    if(data === undefined){
      getBanner()
      getService()
      return
    }
    console.log(data)
    if(data['services'] === undefined){
      getService()
    }else{
      setService(data['services'])
    }
    if(data['banner'] === undefined){
      getBanner()
    }else{
      setBanner(data['banner'])
    }
    
  }, []);
  var settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          // dots: true,
          // arrows: true, 
        }
      },
      {
        breakpoint: 600, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
          dots: false, 
          arrows: false, 
        }
      },
    ]
  };
  return (
    
    <div>
      <Layout>
        <>
        <div className="my-5">
        <div className="grid grid-cols-12">
          {services.map((service, index)=>(<div className="col-span-4 sm:col-span-2 md:col-span-1 cursor-pointer " key={index} onClick={()=>changePage(service.service_code)}>
            <div className="w-full flex justify-center">
              <img src={service.service_icon} className="rounded-lg w-16 h-16 md:w-24 md:h-24" alt="" style={{}} />
            </div>
            
            <p className="text-center text-sm md:text-md 2xl:text-lg">{service.service_name}</p>
            </div>))}
        </div>
        
       
      </div>
      <div className="mt-5">
          <Slider {...settings}>
            {banner.map((image, index) => (
          <div key={index}>
            <img src={image.banner_image} className="w-full px-3" alt={`Slide ${index}`} />
          </div>
        ))}
          </Slider>

      </div>
        </>
      </Layout>
    </div>
  )
}
