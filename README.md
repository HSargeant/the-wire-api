# The Wire API

## Documentation

The API for the seminal TV series. This documentation will help
with all you need to begin making your request.

## Base URL
https://the-wire-api.up.railway.app/api

Visit here for full documentation


## Character Endpoints

#### Character Attributes

| Attribute   | Type          | Description  									  |
| ----------- |------------- | ------------------------------------------------- |
| char_id     | string  	  | Unique Id per character							  |
| name        | string        | A character's full name |
| occupation  | array         | List of known occupation/s	|
| image       | string        | Character's image								  |
| status      | string        | Are the still in the game or dead    			  |
| aka		  | string        | A nickname or alias the character is referred as  |
| seasons	  | array         | List of seasons that the character appeared in    |
|first-seen   | string			| The first episode the character makes an appearance|
|lasy-seen   | string			| The episode that the character makes their final appearance|


#### Get info about all characters
Endpoint to retrieve information from all characters.
```
/api/characters
```

#### Get single character
```
by id#: /api/characters/1
by name: /api/characters/name
		*** can use first name, last name, or nickname/alias ***
		***	examples: '/api/characters/bunk' , '/api/characters/the greek'
``` 

## Quote Endpoints

#### Quote Attributes

| Attribute   | Type          | Description  					  |
| ----------- | ------------- | --------------------------------  |
| quote       | string        | The quote						  |
| name	      | string        | The character that said the quote |

#### Get all quotes
```
/api/quotes
```

#### Get a random quote
```
/api/quotes/random
```

#### Get quote by author
```
/api/quote/Bunk, /api/quote/Mcnulty etc... 
```
This endpoint allows you to get all quotes from a specific character.

## Death Endpoints

#### Death Attributes

| Attribute         | Type          | Description  												 |
| ----------------- | ------------- | -----------------------------------------------------------|
| name              | string        | The name of the deceased character 						 |
| cause             | string        | How the character died		  							 |
| responsible       | string        | Who is directly responsible for their death				 |
| season            | integer       | The season the death occured in   						 |
| episode           | integer       | The episode of the season									 |

#### Get all death information
```
/api/deaths
```

#### Get random death information about an individual
```
/api/deaths/random-death
```
