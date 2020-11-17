const express = require("express");
const joi = require('@hapi/joi')
const MoviesService = require('../services/movies')

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler');

function moviesApi(app) {
  const router = express.Router(); 
  const moviesService = new MoviesService();  
  

  app.use("/api/movies", router)
  router.get("/", async function (req, res, next) {
   const { tags } = req.query;
    try { 
      const movies = await moviesService.getMovies({ tags });
      

      res.status(200).json({
        data: movies,
        message: 'movies list'
      })
    } catch (error) {
      next(error);
    }
  })

  // Obtener movie por id
  router.get("/:movieId", validationHandler(joi.object({ movieId: movieIdSchema }), 'params'), async function (req, res, next) {
    const { movieId } = req.params;  
    try {
      const movies = await moviesService.getMovie({movieId});
      res.status(200).json({
        data: movies,
        message: 'movies retrieved'
      })
    } catch (error) {
      next(error);
    }
  })

  // create
  router.post("/", validationHandler(createMovieSchema), async function (req, res, next) {
    const { body: movie} = req;  
    
    try {
      const createdMovieId = await moviesService.createMovie({ movie })
      res.status(201).json({
        data: createdMovieId,
        message: 'movie created'
      })
    } catch (error) {
      next(error);
    }
  })

  // PUT - actualizar
  router.put("/:movieId", validationHandler(({ movieId: movieIdSchema }), 'params'), validationHandler(updateMovieSchema) ,async function (req, res, next) {
    const { body: movie} = req;
    const { movieId } = req.params; 
    try {
      const updatedMovieId = await moviesService.updateMovie({ movie, movieId });
      res.status(200).json({
        data: updatedMovieId,
        message: 'movie updated'
      })
    } catch (error) {
      next(error);
    }
  })

  // delete
  router.delete("/:movieId", async function (req, res, next) {
    const { movieId } = req.params;  
    try {
      const deleteMovieId = await moviesService.deleteMovie({ movieId });
      res.status(200).json({
        data: deleteMovieId,
        message: 'movies deleted'
      })
    } catch (error) {
      next(error);
    }
  })

}

module.exports = moviesApi;