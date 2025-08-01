import React, { useEffect } from "react"
import Slider from "react-slick";

import { useState } from "react"
import { useSelector} from "react-redux"
import { useLoaderData, useNavigate } from "react-router"
import Layout from '../layouts/base-header-profile'
import apiClient from "../parameter/axios-global";
import loadingIcon from '../assets/images/loading.png'

export default function dashboard() {
  const auth = useSelector((state)=>state.auth)
  // const data = useLoaderData()
  const navigate = useNavigate()
  const [services, setService] = useState({'data':[], 'isLoad':false, 'error':false,})
  const [banner, setBanner] = useState([])
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function getService(){
    setService({...services, isLoad:true})
    try{
        // await delay(5000)
        const resService = await apiClient.get('/services')
        setService({data:resService.data?.data, isLoad:false, error:false})
        // setService((resService.data?.data || [] ))
      }catch(err){
        setService({...services, isLoad:false, error:true})
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
    // if(data === undefined){
    //   getBanner()
    //   getService()
    //   return
    // }
    getService()
    getBanner()
    // if(data['services'] === undefined || data['services'] ===null){
    //   getService()
    // }else{
    //   try{
    //     setService({...services, data:data['services']})
    //   }catch(err){
    //     getService()
    //   }
    // }
    // if(data['banner'] === undefined){
    //   getBanner()
    // }else{
    //   setBanner(data['banner'])
    // }
    
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
        {
          services.isLoad ?
            <div className="grid grid-cols-12 ">
              {
                
                [0,0,0].map((e, i)=>(
                  <div className="col-span-4 md:col-span-1 me-2" key={i}>
                    <div className="w-full flex justify-center">
                      <img src={loadingIcon} className="rounded-lg w-16 h-16 md:w-24 md:h-24" alt="" style={{}} />
                    </div>
                    
                  </div>
                ))
              }
              
            </div>
            :
          services.error?
            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-4">
                <p>Error get Service, please try again</p>
                <button
                    onClick={()=>getService()}
                    type="submit"
                    className="mb-3 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                >
                    Reload
                </button>
              </div>
            </div>
            :
            <div className="grid grid-cols-12">
          
            {services.data.map((service, index)=>(<div className="col-span-4 sm:col-span-2 md:col-span-1 cursor-pointer mb-2" key={index} onClick={()=>changePage(service.service_code)}>
              <div className="w-full flex justify-center">
                <img src={service.service_icon} className="rounded-lg w-16 h-16 md:w-24 md:h-24" alt="" style={{}} />
              </div>
              <div className="text-center text-sm md:text-md 2xl:text-lg h-12 md:h-16">
                {service.service_name}
              </div>
              {/* <p className="text-center text-sm md:text-md 2xl:text-lg"></p> */}
              </div>))}
        </div>
        }
        
        
       
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
