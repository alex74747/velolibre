import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown/with-html'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import frontMatter from 'front-matter'
import gfm from 'remark-gfm'

var req = require.context('./articles', true, /\.md$/)
const rawArticles = [...req.keys()]
	.filter((key) => !key.includes('brouillon'))
	.map((key) => [key.replace('./', '').replace('.md', ''), req(key).default])
console.log({ rawArticles })

export const parsedArticles = rawArticles.map(([id, string]) => ({
	...frontMatter(string),
	id,
}))

export const dateCool = (date) =>
	date.toLocaleString(undefined, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

const repo = 'laem/velolibre'

const getLastEdit = (name, action) =>
	fetch(
		`https://api.github.com/repos/${repo}/commits?path=src%2Farticles%2F${name}.md&page=1&per_page=1`
	)
		.then((res) => res.json())
		.then((json) => {
			try {
				const date = json[0].commit.committer.date
				action(dateCool(new Date(date)))
			} catch (e) {
				action('')
			}
		})

const thumbnailWidth = '320',
	fullWidth = '800'

export const imageResizer = (size) => (src) =>
	src.includes('imgur.com')
		? src.replace(/\.(png|jpg)$/, size + '.jpg')
		: src.includes('unsplash.com')
		? src.replace(
				/w=[0-9]+\&/,
				(_, p1) => `w=${size === 'm' ? thumbnailWidth : fullWidth}&`
		  )
		: src.includes('medium.com')
		? src.replace(
				/max\/[0-9]+\//,
				(_, p1) => `max/${size === 'm' ? thumbnailWidth : fullWidth}/`
		  )
		: src

export default ({}) => {
	const { id } = useParams()
	const theOne = parsedArticles.find(({ id: id2 }) => id === id2)

	const [lastEditDate, setLastEditDate] = useState(null)

	const {
		attributes: { titre, date, image, sombre },
		body,
	} = theOne

	getLastEdit(id, setLastEditDate)

	return (
		<div
			css={`
				padding: 1rem;
				${sombre
					? `
					background:  linear-gradient(#000, #9198e5); color: white
						; a {color: inherit}`
					: ''}
			`}
		>
			<div css={() => articleStyle}>
				<p
					css={`
						text-align: center;
						font-style: italic;
						opacity: 0.8;
						margin-bottom: 2rem;
						small {
							font-size: 70%;
						}
					`}
				>
					<small>
						{lastEditDate && (
							<span>
								Mis à jour le{' '}
								<a
									href={`https://github.com/${repo}/blob/master/articles/${id}.md`}
								>
									{lastEditDate}
								</a>
							</span>
						)}
					</small>
				</p>
				<ReactMarkdown
					renderers={{ image: ImageRenderer, link: RouterLink }}
					source={body}
					escapeHtml={false}
					plugins={[gfm]}
				/>
				<hr />
			</div>
		</div>
	)
}

const ImageRenderer = ({ src }) => <img src={imageResizer('l')(src)} />

function RouterLink(props) {
	return props.href.match(/^(https?:)?\/\//) ? (
		<a href={props.href}>{props.children}</a>
	) : (
		<Link to={props.href}>{props.children}</Link>
	)
}

const articleStyle = `
font-size: 125%;
	max-width: 700px;
	margin: 0 auto 4rem;
	h1 {
		text-align: center;
	}
	h2,
	h3,
	h4,
	h5 {
		margin-top: 2rem;
	}
	img {
		max-width: 80%;
		margin: 2rem auto;
		display: block;
	}
	img + em {
	color: #666;
	text-align: center;
	width: 100%;
	display: inline-block;
	margin: 0 auto 1rem;
	}
	hr {
		border: 1px solid #eee;
		width: 70%;
		margin: 2rem auto;
	}
	blockquote {
		border-left: 3px solid #4d4d4d;
		padding-left: 1rem;
		margin-left: 0;
	}
	code {
		background: #eee;
		padding: 0.1rem 0.4rem;
		border-radius: 0.3rem;
	}

aside {
	border: 1px solid #ddd;
	border-radius: 0.3rem;
	box-shadow: 1px 3px 8px #ddd;
	padding: 1rem;
	margin: 2rem .6rem
	}
	aside h2, aside h3 {
margin: .3rem
	}

	`
