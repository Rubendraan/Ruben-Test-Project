var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var BookModel = require('../models/Student');

var bookType = new GraphQLObjectType({
    name: 'student',
    fields: function () {
      return {
        _id: {
          type: GraphQLString
        },
        studentID: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        },
        course: {
          type: GraphQLString
        },
        address: {
          type: GraphQLString
        },
        age: {
          type: GraphQLInt
        },
        hobby: {
          type: GraphQLString
        },
        updated_date: {
          type: GraphQLDate
        }
      }
    }
  });

  var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
      return {
        students: {
          type: new GraphQLList(bookType),
          resolve: function () {
            const students = BookModel.find().exec()
            if (!students) {
              throw new Error('Error')
            }
            return students
          }
        },
        student: {
          type: bookType,
          args: {
            id: {
              name: '_id',
              type: GraphQLString
            }
          },
          resolve: function (root, params) {
            const studentDetails = BookModel.findById(params.id).exec()
            if (!studentDetails) {
              throw new Error('Error')
            }
            return studentDetails
          }
        }
      }
    }
  });

  var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
      return {
        addStudent: {
          type: bookType,
          args: {
            studentID: {
              type: new GraphQLNonNull(GraphQLString)
            },
            name: {
              type: new GraphQLNonNull(GraphQLString)
            },
            course: {
              type: new GraphQLNonNull(GraphQLString)
            },
            address: {
              type: new GraphQLNonNull(GraphQLString)
            },
            age: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            hobby: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve: function (root, params) {
            const bookModel = new BookModel(params);
            const newStudent = bookModel.save();
            if (!newStudent) {
              throw new Error('Error');
            }
            return newStudent
          }
        },
        updateStudent: {
          type: bookType,
          args: {
            id: {
              name: 'id',
              type: new GraphQLNonNull(GraphQLString)
            },
            studentID: {
              type: new GraphQLNonNull(GraphQLString)
            },
            name: {
              type: new GraphQLNonNull(GraphQLString)
            },
            course: {
              type: new GraphQLNonNull(GraphQLString)
            },
            address: {
              type: new GraphQLNonNull(GraphQLString)
            },
            age: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            hobby: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve(root, params) {
            return BookModel.findByIdAndUpdate(params.id, { studentID: params.studentID, name: params.name, course: params.course, address: params.address, age: params.age, hobby: params.hobby, updated_date: new Date() }, function (err) {
              if (err) return next(err);
            });
          }
        },
        removeStudent: {
          type: bookType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve(root, params) {
            const remBook = BookModel.findByIdAndRemove(params.id).exec();
            if (!remBook) {
              throw new Error('Error')
            }
            return remBook;
          }
        }
      }
    }
  });

  module.exports = new GraphQLSchema({query: queryType, mutation: mutation});