import React, { useState } from 'react'
import { Markdown } from './utils'
import { Link, useParams } from 'react-router-dom'
import { WikiPage, loadPages, getLastEdit } from './wiki'
import { Summary } from './Montage'

var req = require.context('../vélos/1/tuto', true, /\.md$/)
export const articles = loadPages(req)

export default ({}) => {
	const { id } = useParams()
	console.log(id, articles)
	const theOne = articles.find(({ id: id2 }) => id === id2)

	const [lastEditDate, setLastEditDate] = useState(null)

	const { body, position, title } = theOne

	getLastEdit(id, setLastEditDate)
	const nextArticle = articles.find(
		({ title, position }) => +position === +theOne.position + 1
	)

	return (
		<div
			css={`
				padding: 1rem;
				header {
					display: flex;
					align-items: center;
				}
				header h2 {
					margin-right: 1rem;
				}
			`}
		>
			<Summary articles={articles} />
			<header>
				<h2>{title}</h2>
				<span>
					{position} / {articles.length}
				</span>
			</header>
			<WikiPage>
				<p
					css={`
						text-align: center;
						font-style: italic;
						opacity: 0.8;
						margin-bottom: 2rem;
					`}
				>
					<small>
						{lastEditDate && (
							<span>
								Mis à jour le{' '}
								<a
									href={`https://github.com/${repo}/blob/master/source/articles/${id}.md`}
								>
									{lastEditDate}
								</a>
							</span>
						)}
					</small>
				</p>
				<Markdown imageRenderer={ImageRenderer(id)} source={body} />
				<hr />
			</WikiPage>
			{nextArticle && (
				<div>
					<h3>Prochaine étape</h3>
					<div>
						▶️{' '}
						<Link to={'/vélos/vl1/montage/' + nextArticle.id}>
							{nextArticle.title}
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

const ImageRenderer = (dir) => ({ src }) => {
	const mode = process.env.NODE_ENV
	const imageBase =
		mode === 'development'
			? 'http://localhost:8081/vl1/'
			: 'https://velolibre-images.netlify.app/'
	const ext = mode === 'development' ? 'jpg' : 'webp'

	return (
		<a href={`${imageBase}${dir}/${src}.${ext}`}>
			<img
				src={`${imageBase}${dir}/${src}.${
					mode === 'development' ? '' : 'medium.'
				}${ext}`}
			/>
		</a>
	)
}
