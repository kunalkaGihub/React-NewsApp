import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {

  const [articles, setArticles] = useState([0])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResult] = useState(0)
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };



  const updateNews = async() => {
    props.setProgress(40)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    let parsedData = await data.json();
    props.setProgress(50)
    //console.log(parsedData)
    setArticles(parsedData.articles)
    setTotalResult(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100)
  }

  const fetchMoreData = async() =>{
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    let data = await fetch(url);
    let parsedData = await data.json();
    //console.log(parsedData)
    setArticles(articles.concat(parsedData.articles))
    setTotalResult(parsedData.totalResults)
  }

  useEffect(() => {
    document.title = `NewsMonkey Function - ${capitalizeFirstLetter(props.category)}`;
    updateNews(); 
    //eslint-disable-next-line
  }, []) //[] first time page load pe hi chalega


  // const handlePrevCLick = async () => {
  //   setPage(page-1)
  //   updateNews();
  // };

  // const handleNextCLick = async () => {
  //   setPage(page+1);
  //   updateNews();
  // };
    const style={
      marginTop: "70px"
    }

    return (
      <>
        <h1 className="my-3 text-center text-dark" style={{paddingTop:"50px"}}>
          NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
        </h1>
        {/* this spinner is for first time loading */}
        {loading && <Spinner/>}   
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
          <div className="row">
            {/* iterate articles */}
            {/* {!this.state.loading && */}
              {articles.map((article) => (
                <div className="col-md-4" key={article.url}>
                  {/* <NewsItem title={article.title?article.title.slice(0,45):""} description={article.description?article.description.slice(0,80):""} imageUrl={article.urlToImage} newsUrl={article.url} /> */}

                  <NewsItem
                    title={article.title ? article.title : ""}
                    description={article.description ? article.description : ""}
                    imageUrl={article.urlToImage}
                    newsUrl={article.url}
                    date={article.publishedAt}
                    author={article.author}
                    source={article.source.name}
                  />
                </div>
              ))}
          </div>
          </div>
        </InfiniteScroll>
      </>
    );
}

News.defaultProps = {
  country: "in",
  pageSize: 9,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};


export default News;
