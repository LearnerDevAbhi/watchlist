// src/seed/seedData.ts

import { UserModel } from './models/user.model';
import { MovieModel } from './models/movie.model';
import { TVShowModel } from './models/tvshow.model';

import bcrypt from 'bcrypt';
import { GenreEnum } from '../utils/commonEnum';

export default async function seed() {
  try {
    // seed user data
    const salt = await bcrypt.genSalt(10);
    await UserModel.deleteMany({email:{$in:['user1@example.com','user2@example.com']}})
    const users = await UserModel.insertMany([
      { id:'7eb9e627-2c59-4816-a53a-56759bcaa907',username: 'user1', email:'user1@example.com',password: await bcrypt.hash('password123', salt),preferences:[],watchHistory:[] },
      { id:'0a1784ad-7b33-4017-916b-4cb00a0e7b89',username: 'user2', email:'user2@example.com',password: await bcrypt.hash('password456', salt),preferences:[],watchHistory:[] }
    ]);

    // seed movie data
    await MovieModel.deleteMany({title:{$in:['The Matrix','Inception','Titanic']}})
    const movies = await MovieModel.insertMany([
        {
          id:'3c8d2108-85c6-41af-9390-1d38e5755c1a',
          title: 'The Matrix',
          description: 'A hacker discovers the reality he lives in is a simulation.',
          genres: [GenreEnum.Action, GenreEnum.SciFi],
          releaseDate: new Date('1999-03-31'),
          director: 'Lana Wachowski, Lilly Wachowski',
          actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
        },
        {
          id:'539cdf49-c511-421d-ad23-d0b987ca18a8',
          title: 'Inception',
          description: 'A thief enters people’s dreams to steal secrets and plant ideas.',
          genres: [GenreEnum.Action, GenreEnum.SciFi, GenreEnum.Drama],
          releaseDate: new Date('2010-07-16'),
          director: 'Christopher Nolan',
          actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
        },
        {
          id:'9a5bb0bb-170c-4726-a100-c98699774bc5',
          title: 'Titanic',
          description: 'A love story blossoms aboard the doomed RMS Titanic.',
          genres: [GenreEnum.Romance, GenreEnum.Drama],
          releaseDate: new Date('1997-12-19'),
          director: 'James Cameron',
          actors: ['Leonardo DiCaprio', 'Kate Winslet'],
        }
      ]);
  
  
      await TVShowModel.deleteMany({title:{$in:['Stranger Things','Breaking Bad','Game of Thrones']}});
      const tvShows = await TVShowModel.insertMany([
        {
          id:'828ae10b-89f0-43bf-aae7-3140fbeb5c46',
          title: 'Stranger Things',
          description: 'A group of kids uncover supernatural mysteries in their small town.',
          genres: [GenreEnum.Fantasy, GenreEnum.Drama, GenreEnum.SciFi],
          episodes: [
            {
              episodeNumber: 1,
              seasonNumber: 1,
              releaseDate: new Date('2016-07-15'),
              director: 'The Duffer Brothers',
              actors: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
            },
            {
              episodeNumber: 2,
              seasonNumber: 1,
              releaseDate: new Date('2016-07-15'),
              director: 'The Duffer Brothers',
              actors: ['David Harbour', 'Gaten Matarazzo'],
            },
          ],
        },
        {
          id:'0cb67f4e-7a4d-4aff-8397-a01e58f6e513',
          title: 'Breaking Bad',
          description: 'A chemistry teacher turns to making meth to secure his family’s future.',
          genres: [GenreEnum.Drama],
          episodes: [
            {
              episodeNumber: 1,
              seasonNumber: 1,
              releaseDate: new Date('2008-01-20'),
              director: 'Vince Gilligan',
              actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
            },
            {
              episodeNumber: 2,
              seasonNumber: 1,
              releaseDate: new Date('2008-01-27'),
              director: 'Vince Gilligan',
              actors: ['Dean Norris', 'Betsy Brandt'],
            },
          ],
        },
        {
          id:'99d8877c-7bec-4fe1-8db5-29a007ff49ac',
          title: 'Game of Thrones',
          description: 'Noble families vie for control of the Seven Kingdoms of Westeros.',
          genres: [GenreEnum.Fantasy, GenreEnum.Drama],
          episodes: [
            {
              episodeNumber: 1,
              seasonNumber: 1,
              releaseDate: new Date('2011-04-17'),
              director: 'Tim Van Patten',
              actors: ['Emilia Clarke', 'Kit Harington', 'Sean Bean'],
            },
            {
              episodeNumber: 2,
              seasonNumber: 1,
              releaseDate: new Date('2011-04-24'),
              director: 'Tim Van Patten',
              actors: ['Lena Headey', 'Peter Dinklage'],
            },
          ],
        }
      ]);

      console.log("SEEDING IS DONE")

  } catch (err) {
        console.error("Error in seeding", err)
        process.exit(1)
  }

}
