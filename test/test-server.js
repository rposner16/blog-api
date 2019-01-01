
const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../server");
const expect = chai.expect;
chai.use(chaiHttp);

describe("BlogPosts", function() {
    
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    // Get test
    it("should return blog posts on GET", function() {
        return chai
            .request(app)
            .get("/blog-posts")
            .then(function(res) {
                expect(res).to.be.json;
                expect(res.body).to.be.a("array")
                expect(res.body.length).to.be.at.least(1);

                const expectedKeys = ["id", "title", "content", "author", "publishDate"];
                res.body.forEach(function(blogPost) {
                    expect(blogPost).to.be.a("object");
                    expect(blogPost).to.include.keys(expectedKeys);
                });
            });
    });

    // Post test
    it("should create a new blog post on POST", function() {
        const newPost = {title: "The title", content: "jsdlfjas;f", author: "Rebecca"};
        return chai
            .request(app)
            .post("/blog-posts")
            .send(newPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
            });
    });

    // Put test
    it("should update a blog post on PUT", function() {
        const updatedPost = {title: "ljsdf", content: "jdslfajf", author: "Rebecca"};
        return chai
            .request(app)
            .get("/blog-posts")
            .then(function(res) {
                updatedPost.id = res.body[0].id;
                return chai
                    .request(app)
                    .put(`/blog-posts/${updatedPost.id}`)
                    .send(updatedPost);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });

    // Delete test
    it("should delete blog posts on DELETE", function() {
        return chai
            .request(app)
            .get("/blog-posts")
            .then(function(res) {
                return chai
                    .request(app)
                    .delete(`/blog-posts/${res.body[0].id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });

});