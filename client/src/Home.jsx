import './output.css'

export default function Home() {
    return (
        <div className="min-h-screen flex justify-center w-4/6 mx-auto flex-col">
            <p className="ml-8 text-lg font-semibold cursor-pointer hover:opacity-80 transition-all ease-in-out duration-400"><span className="bg-green-400 border-2 border-green-400 bg-opacity-50 px-4 py-1 rounded-full mr-5">Official Launch!</span> Read About our Application &#10230;</p>
            <h1 className="text-8xl p-10 font-extrabold">Manage Homework, Efficient and Quick</h1>
            <p className={`ml-8 text-2xl w-3/5 leading-relaxed text-gray-500`}>WorkTracker looks towards a future with on time submissions from students and adults all around the world. Here at WorkTracker, we aim to revolutionize the world of assignments and hope to help eliminate pprocrastination of projects and homework alike.</p>
        </div>
    )
}