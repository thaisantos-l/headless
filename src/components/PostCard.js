import Link from 'next/link';
import Image from 'next/image';


export default function PostCard({ post }) {
  const title = post.title?.rendered || 'Sem título';
  const slug = post.slug;
  const excerpt = post.excerpt?.rendered || '';
  const date = new Date(post.date).toLocaleDateString('pt-BR');
  const featured = post._embedded?.['wp:featuredmedia']?.[0];
  const img = featured?.media_details?.sizes?.medium?.source_url || featured?.source_url || null;
  const termGroups = post._embedded?.['wp:term'] || [];


const cats = termGroups
  .reduce((acc, group) => acc.concat(group || []), [])
  .filter(t => t?.taxonomy === 'category')
  .map(t => t.name);

{cats.length > 0 && (
  <div className="meta">Categorias: {cats.join(' · ')}</div>
)}
 
  return (
   
            <article className="flex max-w-xl flex-col items-start justify-between">
              <Link href={`/post/${slug}`}>
                    <div className="mt-8 w-full justify-self-stretch overflow-hidden rounded-[16px]">
                      
                            {img && <Image className="block w-full h-64 md:h-72 lg:h-80 object-cover rounded-[16px]" loading="lazy" src={img} alt={featured?.alt_text || title} />}
                      
                    </div>
                    <div className="flex items-center gap-x-1 text-xs">
                          <time dateTime={date} className="text-gray-100">
                            Publicado em {date}
                        </time>
                        {cats.length > 0 && (
                            <div className="relative z-10 rounded-full bg-gray-800/60 px-3 py-1.5 font-medium text-gray-300">{cats.join(' · ')}</div>
                          )} 
                        
                    </div>
                    <div className="group relative grow">
                      <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-gray-300">                      
                          <span className="absolute inset-0" /> 
                          {title}                        
                      </h3>                    
                      <div className="mt-5 line-clamp-3 text-sm/6 text-gray-400" dangerouslySetInnerHTML={{ __html: excerpt }} />
                    </div>
                  </Link>
            </article>
     
  ); 
}
