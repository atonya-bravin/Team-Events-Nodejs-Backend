import { Router } from 'express'
import upload from "../config/multer-cloudinary-config"; 
import {
	createEvent,
	eventSearch,
	getAllEvents,
	getEventById,
	getFriendEvent,
	deleteEvent,
} from '../Controllers/event.controller'
const router = Router()

/*@POST /event
 * This route should take care of creating events should return a 201
 * PROTECTED ROUTE
 */
router.post('/',upload.single('image'), createEvent)

/*@GET /event
 * This route should take care of getting events created by all users
 * PROTECTED ROUTE
 */
router.get('/', getAllEvents)

/*@GET /event/friends
 * This route should take care of getting all events of members of shared groups
 * PROTECTED ROUTE
 */
router.get('/friends', getFriendEvent)

/*@GET /event/search?keyword=
 * This route should take care of the searching event by name
 */
router.get('/search', eventSearch)

/*@GET /event/info/eventId
 * This route should take care of getting a particular event
 */
router.get('/info/:eventId', getEventById)

/*@DELETE /event/eventId
 * This route should take care of deleting a particular event
 */
router.delete('/:eventId', deleteEvent)

export default router
