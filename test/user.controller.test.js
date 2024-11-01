const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const { expect } = chai
chai.use(chaiHttp)

const userController = require('../controllers/user.controller')
const gameController = require('../controllers/game.controller')
const User = require('../models/user.model')
const Game = require('../models/game.model')
const jwt = require('jsonwebtoken')
const {
  loginController,
  registerController,
  loginControllerForAdmin,
  logoutController,
} = require('../controllers/auth.controller')
const { StatusCodes } = require('http-status-codes')

describe('User Controller', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('getAllUsers', () => {
    it('should return all users with status 200', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ]
      sinon.stub(User, 'getAllUsers').resolves(mockUsers)

      const req = {}
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await userController.getAllUsers(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ users: mockUsers })).to.be.true
    })
  })

  describe('getUserById', () => {
    it('should return user by id with status 200', async () => {
      const mockUser = { id: 1, name: 'User 1' }
      sinon.stub(User, 'getUserById').resolves(mockUser)

      const req = { params: { id: 1 } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await userController.getUserById(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ user: mockUser })).to.be.true
    })
  })

  describe('createUser', () => {
    it('should create a new user and return affected rows with status 200', async () => {
      sinon.stub(User, 'createUser').resolves({ affectedRows: 1 })

      const req = { body: { name: 'New User' } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await userController.createUser(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ record_inserted: 1 })).to.be.true
    })
  })

  describe('updateUser', () => {
    it('should update an existing user and return affected rows with status 200', async () => {
      sinon.stub(User, 'updateUserById').resolves({ affectedRows: 1 })

      const req = { params: { id: 1 }, body: { name: 'Updated Name' } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await userController.updateUser(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ record_updated: 1 })).to.be.true
    })
  })

  describe('deleteUser', () => {
    it('should delete a user and return affected rows with status 200', async () => {
      sinon.stub(User, 'deleteUser').resolves({ affectedRows: 1 })

      const req = { params: { id: 1 } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await userController.deleteUser(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ record_deleted: 1 })).to.be.true
    })
  })

  describe('changePassword', () => {
    it('should change user password and return affected rows with status 200', async () => {
      sinon.stub(User, 'changePassword').resolves({ affectedRows: 1 })

      const req = { user: { userId: 1 }, body: { password: 'newPassword' } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await userController.changePassword(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ record_updated: 1 })).to.be.true
    })
  })

  describe('changeName', () => {
    it('should change user name and return affected rows with status 200', async () => {
      sinon.stub(User, 'changeName').resolves({ affectedRows: 1 })

      const req = { params: { id: 1 }, body: { name: 'New Name' } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await userController.changeName(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ record_updated: 1 })).to.be.true
    })
  })
})

describe('Game Controller', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('getAllGames', () => {
    it('should return all games for the user with status 200', async () => {
      const mockGames = [
        { id: 1, name: 'Game 1' },
        { id: 2, name: 'Game 2' },
      ]
      sinon.stub(Game, 'getAllGames').resolves(mockGames)

      const req = { user: { userId: 1 } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await gameController.getAllGames(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ games: mockGames })).to.be.true
    })
  })

  describe('getGameById', () => {
    it('should return a single game by game ID with status 200', async () => {
      const mockGame = { id: 1, name: 'Game 1' }
      sinon.stub(Game, 'getGameById').resolves(mockGame)

      const req = { params: { id: 1 }, user: { userId: 1 } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await gameController.getGameById(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ game: mockGame })).to.be.true
    })
  })

  describe('createGame', () => {
    it('should create a game and return affected rows with status 200', async () => {
      sinon.stub(Game, 'createGame').resolves({ affectedRows: 1 })

      const req = { body: { name: 'New Game' }, user: { userId: 1 } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await gameController.createGame(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ record_inserted: 1 })).to.be.true
    })
  })

  describe('updateGameById', () => {
    it('should update a game and return affected rows with status 200', async () => {
      sinon.stub(Game, 'updateGameById').resolves({ affectedRows: 1 })

      const req = {
        params: { id: 1 },
        body: { name: 'Updated Game' },
        user: { userId: 1 },
      }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      }

      await gameController.updateGameById(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.json.calledWith({ record_updated: 1 })).to.be.true
    })
  })

  describe('deleteGameByIdUser', () => {
    it('should delete a game and return a success message with status 200', async () => {
      sinon.stub(Game, 'deleteGameByIdUser').resolves({ affectedRows: 1 })

      const req = { params: { id: 1 } }
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      }

      await gameController.deleteGameByIdUser(req, res)

      expect(res.status.calledWith(StatusCodes.OK)).to.be.true
      expect(res.send.calledWith({ record_updated: 'delete successfully!' })).to
        .be.true
    })
  })
})

describe('Auth Controller Tests', () => {
  let req, res, userStub, jwtStub

  beforeEach(() => {
    req = { body: {}, session: {} }
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      send: sinon.stub(),
      cookie: sinon.stub(),
    }

    // Stub các phương thức của User model và JWT
    userStub = sinon.stub(User)
    jwtStub = sinon.stub(jwt, 'sign').returns('fake_token')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('registerController', () => {
    it('should register a new user and return token', async () => {
      req.body = { username: 'testUser', password: 'testPass' }
      userStub.register.resolves([{ ID: 1, USERNAME: 'testUser' }])
      userStub.createJWT.returns('fake_token')

      await registerController(req, res)

      expect(res.status.calledWith(StatusCodes.CREATED)).to.be.true
      expect(
        res.json.calledWith({
          User: { id: 1, username: 'testUser' },
          token: 'fake_token',
        })
      ).to.be.true
    })
  })

  describe('loginController', () => {
    it('should login user with correct credentials', async () => {
      req.body = { username: 'testUser', password: 'testPass' }
      userStub.login.resolves([{ ID: 1, USERNAME: 'testUser' }])
      userStub.createJWT.returns('fake_token')

      await loginController(req, res)

      expect(res.status.calledWith(StatusCodes.CREATED)).to.be.true
      expect(res.cookie.calledWith('token', 'fake_token')).to.be.true
      expect(
        res.json.calledWith({
          User: { id: 1, username: 'testUser' },
          token: 'fake_token',
        })
      ).to.be.true
    })

    it('should return 401 if credentials are incorrect', async () => {
      req.body = { username: 'testUser', password: 'wrongPass' }
      userStub.login.resolves([])

      await loginController(req, res)

      expect(res.status.calledWith(StatusCodes.UNAUTHORIZED)).to.be.true
      expect(res.json.calledWith({ msg: 'password or username is wrong!' })).to
        .be.true
    })
  })

  describe('loginControllerForAdmin', () => {
    it('should login admin user with correct credentials', async () => {
      req.body = { username: 'adminUser', password: 'adminPass' }
      userStub.login.resolves([{ ID: 1, USERNAME: 'adminUser', ADMIN: true }])
      userStub.createJWT.returns('admin_token')

      await loginControllerForAdmin(req, res)

      expect(res.status.calledWith(StatusCodes.CREATED)).to.be.true
      expect(res.cookie.calledWith('token', 'admin_token')).to.be.true
      expect(
        res.send.calledWith({
          User: { id: 1, username: 'adminUser' },
          token: 'admin_token',
        })
      ).to.be.true
    })

    it('should return 404 if admin credentials are incorrect', async () => {
      req.body = { username: 'adminUser', password: 'wrongPass' }
      userStub.login.rejects()

      await loginControllerForAdmin(req, res)

      expect(res.status.calledWith(StatusCodes.NOT_FOUND)).to.be.true
      expect(res.send.calledWith({ msg: 'password or username is wrong!' })).to
        .be.true
    })
  })
  describe('logoutController', () => {
    it('should clear the cookie and logout user', async () => {
      req.token = 'fake_token'

      await logoutController(req, res)

      expect(res.cookie.calledWith('newtoken', null)).to.be.true
      expect(res.status.calledWith(201)).to.be.true
      expect(
        res.send.calledWith({ msg: 'Log out successfully!', token: res.cookie })
      ).to.be.true
    })
  })
})
