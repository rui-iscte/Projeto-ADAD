import React, { useState, useEffect } from "react";

export default function App() {

  return (
    <React.Fragment>
      <div className="jumbotro pt-5 pb-5">
        <div className="container text-left">
          <h1 className="display-4">Project, front-end application!</h1>
          <p className="lead">This document/sample presents the struture for the front-end practical work for the ADAD course evaluation.</p>
          <hr className="my-4" />
          <p>Armazenamento de dados em ambientes distribuidos (ADAD) | Mestrado em Engenharia de Telecomunicações e Informática (METI)</p>
          <p className="lead">
            <a className="btn btn-primary btn-lg" href="/books" role="button">Books &rarr;</a>
            <a className="btn btn-primary btn-lg ms-1" href="/users" role="button">Users &rarr;</a>
            <a className="btn btn-primary btn-lg ms-1" href="/livrarias" role="button">Livrarias &rarr;</a>
          </p>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row mb-5">
          <div className="row-md-5">
            <h2>Tasks List:</h2>
            <ul>
              <li>/books get page DONE</li>
              <li>/books get books with limit sorted by score DONE</li>
              <li>/books get books with score 5 DONE</li>
              <li>/books get books sorted by total reviews DONE</li>
              <li>/books get books filtered by review year DONE</li>
              <li>/users get page DONE</li>
              <li>/book/:id get page DONE</li>
              <li>/user/:id get page DONE</li>
              <li>/book/ post page DONE</li>
              <li>/user/ post page DONE</li>
              <li>/book/ put page DONE</li>
              <li>/user/ put page DONE</li>
              <li>/book/:id delete DONE (button: the button is inside the BookCard instead of the actual /book/:id, we thought it looked better this way)</li>
              <li>/user/:id delete DONE (button: the button is inside the UserCard instead of the actual /user/:id, we thought it looked better this way)</li>
              <li>/book/filter get books with filters TODO</li>
              <li>/book/jobReviews get reviews per jobs page DONE</li>
              <li>/comment/ post comment DONE</li>
              <li>/comment/ delete DONE (button: the button is inside the CommentCard, we thought it looked better this way)</li>
              <li>/livrarias/near/ get page DONE</li>
              <li>/livrarias/near/route/ page get DONE</li>
              <li>/livrarias/feiradolivro/ get DONE</li>
              <li>/livrarias/:id get DONE</li>
              <li>/livrarias/:id put DONE</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row mb-5">
          <div className="col-md-4">
            <h2>Requirements for evaluation</h2>
            <ul>
              <li>Create /users page</li>
              <li>Create /user/:id page</li>
              <li>Create /book/:id page</li>
              <li>Edit BookCard component</li>
              <li>Inside /user/:id page create button to delete user from database</li>
              {/* <li>Save a digital transaction proof of a rating</li> */}
            </ul>
          </div>
          <div className="col-md-4">
            <h2>Assessment components</h2>
            <p>Group report on the work done by each student of the group;<br />
              Application developed;<br />
              Oral discussion with individual questions.</p>
          </div>
          <div className="col-md-4">
            <h2>Delivery dates</h2>
            <p><span className="text-decoration-underline">Frontend Project upload</span> on Moodle by <strong>December 15 at 23h59</strong>;<br />
              <span className="text-decoration-underline">Demo and answering to questions of the second part of the project (Frontend)</span> <strong>December 17</strong>.</p>
          </div>
        </div>
        {/* <div className="row mt-5">
          <h3 className="pb-3 mb-4 font-italic border-bottom">Digital Wallet (Leather)</h3>
          <div className="col-sm-6">
            <ul className="list-group">
              <li className="list-group-item">1. <a href="">Install the extension for Chrome, Brave or Firefox</a></li>
              <li className="list-group-item">2. Open extension in your browser</li>
              <li className="list-group-item">3. Select "Create a new wallet"</li>
              <li className="list-group-item">4. If you've selected "Create a wallet", follow the instructions provided to generate and save a 24-word Secret Key.</li>
              <li className="list-group-item">5. Change Network to "Testnet"</li>
              <li className="list-group-item">6. <a href="https://explorer.hiro.so/sandbox/faucet?chain=testnet">Request STX from faucet.</a></li>
            </ul>
          </div>
        </div> */}

      </div>
    </React.Fragment>
  )
}